const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//use merge params to get access to the tour router
const router = express.Router({ mergeParams: true });

//no one can access the routes below without being logged in
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourAndUSerIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
