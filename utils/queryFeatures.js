class queryFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filters() {
    let filterStr = JSON.stringify(this.queryStr);
    filterStr = filterStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`);
    const queryObj = JSON.parse(filterStr);
    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(' ');
      this.query = this.query.sort(sortBy);
    } else {
    //   this.query = this.query.sort(queryObj);
    }
    return this;
  }

  limitFields(){
    if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(',').join(' ')
        this.query = this.query.select(fields);
      } else {
        // this.query = this.query.select(queryObj);
      }
      return this
  }

 pagenation(){
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 5;
    // Page 1: 1-10, Page 2: 11-20
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   const movieCount = await Movie.countDocuments();
    //   if (skip >= movieCount) {
    //     throw new Error("Page Not Found");
    //   }
    // }
    return this
  }
}
module.exports = queryFeatures;
