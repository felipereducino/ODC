'use strict';

const mongoose = require('mongoose');

const Post = mongoose.model('Post');

const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

module.exports = app => {
  const {
    existOrError,
    notExistOrError,
    notSpecialOrError,
  } = app.src.config.validation;

  const index = async (req, res) => {
    const { category } = req.params;

    const posts = await Post.find({ category });

    return res.status(200).json({
      message: 'Sucesso',
      error: false,
      content: posts,
    });
  };

  const store = async (req, res) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './public/upload');
      },
      filename: (req, file, cb) => {
        cb(
          null,
          crypto.randomBytes(10).toString('hex') +
            Date.now() +
            path.extname(file.originalname).toLowerCase()
        );
      },
    });

    const upload = multer({
      storage,
      fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (
          ext !== '.png' &&
          ext !== '.jpg' &&
          ext !== '.gif' &&
          ext !== '.jpeg' &&
          ext !== '.bmp'
        ) {
          return callback(new Error());
        }

        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 1, // 1MB,
      },
    }).file('file');

    upload(req, res, async err => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({
          message: 'Algo deu errado',
          error: true,
          content: null,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: 'Você deve selecionar um arquivo',
          error: true,
          content: null,
        });
      }

      const { content, category } = req.body;
      let { name } = req.body;

      let url = null;

      try {
        existOrError(name, 'Por favor, digite o nome do post');
        name = name.trim();
        notSpecialOrError(
          name,
          'O nome do post não pode ter caracteres especiais'
        );
        url = name.replace(/\s/g, '-').toLowerCase();
        const checkPost = await Post.findOne({ url });
        notExistOrError(
          checkPost,
          'Já existe um post com esse nome registrado'
        );
        existOrError(content, 'Por favor, digite o conteúdo do post');
        existOrError(category, 'Algo deu errado');
      } catch (message) {
        return res.status(400).json({
          message,
          error: true,
          content: null,
        });
      }

      const post = await Post.create({
        photo: req.file.filename,
        name,
        content,
        category,
        url,
      });

      return res.status(200).json({
        message: 'Sucesso',
        error: false,
        content: post,
      });
    });
  };

  return {
    index,
    store,
  };
};
