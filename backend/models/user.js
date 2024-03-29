const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Укажите свой email'],
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательное поле'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина поля "имя" - 2'],
    maxlength: [30, 'Максимальная длина поля "имя" - 30'],
  },
}, { versionKey: false });

userSchema.methods.toJSON = function checkPassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
