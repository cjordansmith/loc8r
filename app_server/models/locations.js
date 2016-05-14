// Use Mongoose to define a Mongoose schema
var mongoose = require( 'mongoose' );

// Define subdocument schema for reviews
var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  reviewText: String,
  createdOn: {
    type: Date,
    "default": Date.now
  }
});

// Define subdocument schema for location openingTimes
var openingTimeSchema = new mongoose.Schema({
  days: {
    type: String,
    required: true
  },
  opening: String,
  closing: String,
  closed: {
    type: Boolean,
    required: true
  }
});

// Define schema for locations
var locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  rating: {
    type: Number,
    "default": 0,
    min: 0,
    max: 5
  },
  facilities: [String],
  coords: {
    type: [Number],
    index: '2dsphere'
  },
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

// Build locationSchema model
mongoose.model('Location', locationSchema);
