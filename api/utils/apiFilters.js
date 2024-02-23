class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    let queryCopy = { ...this.queryStr };

    //remove field
    const { keyword, ...rest } = queryCopy;

    queryCopy = rest;

    //advance filter for price, ratings etc

    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
}

export default APIFilters;
