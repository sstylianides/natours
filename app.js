const path = require('path');
//need to import the express framework
const express = require('express');
//morgan is an http request logger
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//parses cookie in browser
const cookieParser = require('cookie-parser');
//error handling class
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//need this to actually use express
const app = express();
//remove this if you don't want to use pug
app.set('view engine', 'pug');
//remove this if you don't want to use pug
app.set('views', path.join(__dirname, 'views'));
//get router middleware
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

//global middleware
//set HTTP Security header
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests.  Please try again in an hour'
});
//use limiter
app.use('/api', limiter);

//to read and write JSON with express
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());
//data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//handling unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
