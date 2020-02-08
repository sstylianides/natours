const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      //min and max can only be used with numbers
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user']
    }
  },
  //the following is for when we have a field that is not stored but is calculated using some other value, it shows up
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//this makes sure that there is only one review per user on a tour.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//this populates the name and photo of user
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

//post middle ware does not need next() function
//post middleware for calculating avg ratings
reviewSchema.post('save', function() {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//pre middleware for calculating avg ratings
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

//post middleware for calculating avg ratings
reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
