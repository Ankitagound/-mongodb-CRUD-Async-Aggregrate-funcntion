const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
global.async = require('async');
//const booksRouter = require('./api/routes/Books');
//const authorRouter = require('./api/routes/Author');
const Books = require('./api/models/Books');
const Author = require('./api/models/Author');


mongoose.connect('mongodb://localhost:27017/CrudOps', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use('/books', booksRouter);
//app.use('/author', authorRouter);
app.use('/author',require('./api/routes/Author'));
app.use('/books',require('./api/routes/Books'))

//ERROR HANDLING

//For not found
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

//For any other type error
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
