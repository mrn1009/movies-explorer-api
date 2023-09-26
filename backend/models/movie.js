const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
  director: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
  duration: {
    type: Number,
    required: [true, 'Обязательное поле'],
  },
  year: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
  description: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
  image: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильная ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Неправильная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Обязательное поле'],
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: [true, 'Обязательное поле'],
  },
  nameRU: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
  nameEN: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
