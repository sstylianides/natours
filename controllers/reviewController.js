const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourAndUSerIds = (req, res, next) => {
  //this allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//get review
exports.getReview = factory.getOne(Review);

//create review
exports.createReview = factory.createOne(Review);

//update review
exports.updateReview = factory.updateOne(Review);

//delete review
exports.deleteReview = factory.deleteOne(Review);

//get all review
exports.getAllReviews = factory.getAll(Review);
