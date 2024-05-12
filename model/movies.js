const mongoose = require("mongoose");
const validator = require("validator");

//   creating a schema
const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
      unique: true,
      maxlength: [10, "movie length must be 10 or less"],
      minlength: [2, "movie length should be atleast 2 or more"],
    },
    descrption: {
      type:String,
      validate: [validator.isAlpha, 'description should only contains alphabets']
    },
    duration: {
       type: Number, 
       required: [true, "Duration requred"] },
    rating: {
      type: Number,
      default: 1.0,
      min: [1, "Rating should be 1 or more"],
      max: [10, "Rating maximum should be 10"]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: { type: String },
    catergory: {
      type: String,
      required: [true, "type of a movie required ie Movie or Series"],
      enum: {
        values: ["Movie", "Series"],
        message: "Not recognizable"
      }
    },
    genre: {
      type: String,
      required: [true, "genre required"],
      enum: {
        values: ["Action", "sci-fi", "adverture", "comedy", "History", "thriller", "Horror"],
        message: "Not recognizable"
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// vitual function/method get duration in hours is not stored in database
movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});
// using Pre method as a middleware before save
movieSchema.pre("save", function (next) {
  this.createdBy = "Hakeem Paul";
  next();
});
// using of post method as a middleware after save
// movieSchema.post("save", function (doc, next) {
//   const content = `A new movie document created with name ${doc.name} by ${doc.createdBy}`;
//   fs.writeFileSync("./marbel/logs/post.txt", content, { flag: "a" }, (err) => {
//     console.log(err.message);
//   });
//   next();
// });
// CRATING A MIDDLEWARE BEFORE FINDING A MOVIE
movieSchema.pre(/^find/, function (next) {
  this.find({ rating: { $gt:  1} });
  next();
});
// Aggregation middleware
movieSchema.pre("aggregate", function (next) {
  console.log(this.pipeline().unshift({ $match: { rating: { $gte: 5 } } }));
  next();
});
// creating a model/document
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
