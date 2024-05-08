const mongoose = require("mongoose");
const fs = require("fs");

//   creating a schema
const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name required"], unique: true },
    descrption: String,
    duration: { type: Number, required: [true, "Duration requred"] },
    rating: { type: Number, default: 1.0 },
    createdBy: String,
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
movieSchema.post("save", function(doc, next){
  const content = `A new movie document created with name ${doc.name} by ${doc.createdBy}`;
  fs.writeFileSync('./marbel/logs/post.txt', content, { flag: 'a' }, (err) => {
    console.log(err.message);
  });
  next()
});
// creating a model/document
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
