require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimit');
const router = require('./routes');

const { PORT = 3000, MONGO = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use(cors({
  credentials: true,
  origin: [
    'https://api.movies.mrn1009.nomoredomainsrocks.ru',
    'http://api.movies.mrn1009.nomoredomainsrocks.ru',
    'https://movies.mrn1009.nomoredomainsrocks.ru',
    'http://movies.mrn1009.nomoredomainsrocks.ru',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
}));
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.use(limiter);

mongoose.connect(MONGO);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
