//need to import the express framework
const express = require('express');
const tourController = require('./../controllers/tourController.js');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const tourRouter = express.Router();

tourRouter.route('/tour-stats').get(authController.protect, tourController.getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

// tour routes

//get all tours route
tourRouter
  .route('/')
  //put authController.protect back in the get request for Tre's app
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createNewTour);

tourRouter
  .route('/:id')
  //put authController.protect back in the get request for Tre's app
  .get(authController.protect, tourController.getTourById)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = tourRouter;
