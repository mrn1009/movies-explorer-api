const router = require('express').Router();
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('/signout', logout);

router.use('*', () => {
  throw new NotFoundError('Страница не существует');
});

module.exports = router;
