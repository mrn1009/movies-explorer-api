const router = require('express').Router();
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.use('/movies', movieRoutes);
router.use('/users', userRoutes);
router.post('/signout', logout);

router.use('*', () => {
  throw new NotFoundError('Страница не существует');
});

module.exports = router;
