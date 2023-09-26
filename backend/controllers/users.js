const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateError = require('../errors/DuplicateError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { ValidationError } = mongoose.Error;

const createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedPassword) => {
      User.create({ name, email, password: hashedPassword })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err instanceof ValidationError) {
            next(new BadRequestError('Переданы некорректные данные'));
          } else if (err.code === 11000) {
            next(new DuplicateError('Пользователь с таким email уже существует'));
          } else {
            next(err);
          }
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthError('Необходимо авторизоваться');
    })
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jsonWebToken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET', { expiresIn: '7d' });
            res
              .cookie('jwt', token, {
                maxAge: 24 * 3600000, // 1d
                httpOnly: true,
                sameSite: 'none',
                secure: true,
              })
              .send({ token });
          } else {
            throw new AuthError('Необходимо авторизоваться');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res
        .clearCookie('jwt')
        .send({ message: 'Успешный выход из системы' });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  logout,
  getCurrentUser,
  updateProfile,
};
