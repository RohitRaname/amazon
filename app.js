const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectLivereload = require('connect-livereload');
const cors = require('cors');

// controller -----------------------------------------
const GlobalErrorHandler = require('./Controller/global_error_handler');
// const productVariantsCreate = require('./product_variants_create');

// router ---------------------------------------------
const authRouter = require('./Routes/Auth/baseAuthRouter');
const product_router = require('./Routes/Product/baseRouter');
const ViewRouter = require('./Routes/view/baseViewRouter');
const userRouter = require('./Routes/User/baseRouter');

const app = express();

app.use(connectLivereload());
app.use(cors('*'));

// set pug
app.set('view engine', 'pug');
app.set('views', './views');
// server static file
app.use(express.static(path.join(__dirname, 'public')));

// // ge t req short url
app.use(morgan('dev'));
app.use(cookieParser());

// // converting data coming to desired form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// console.log('recive req');
app.use((req, res, next) => {
  console.log('body', req.body);

  next();
});

app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/products/', product_router);
app.use('/api/v1/users', userRouter);
app.use('/', ViewRouter);

// arrow function simply return the function
app.use('*', (req, res, next) => {
  console.error(`Route doesn't exist ${req.originalUrl}`);
  next();
});

app.use(GlobalErrorHandler);

module.exports = app;
