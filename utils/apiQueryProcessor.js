module.exports = class APIQueryProcessor {
    constructor(Model, reqQuery) {
        this.filterObject = this._prepareFilterObject({ ...reqQuery });
        this.Model = Model;
        this.query = Model.find();
    }

    _prepareFilterObject(reqQuery) {
        reqQuery = this._excludeFields(reqQuery);
        reqQuery = this._replaceMongoOperators(reqQuery);
        return reqQuery;
    }

    _excludeFields(reqQuery) {
        ({
            page: this._page,
            limit: this._limit,
            sort: this._sort,
            fields: this._fields,
        } = reqQuery);
        const excludedFields = ["page", "limit", "sort", "fields"];
        excludedFields.forEach((el) => delete reqQuery[el]);
        return reqQuery;
    }

    _replaceMongoOperators(reqQuery) {
        const queryString = JSON.stringify(reqQuery).replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        reqQuery = JSON.parse(queryString);
        return reqQuery;
    }

    filter() {
        this.query.find(this.filterObject);
        return this;
    }

    sort() {
        if (this._sort) {
            const parsedSort = this._sort.replace(/,/g, " ");
            this.query.sort(parsedSort);
        } else {
            this.query.sort("-createdAt");
        }
        return this;
    }

    project() {
        if (this._fields) {
            const parsedFields = this._fields.replace(/,/g, " ");
            this.query.select(parsedFields);
        } else {
            this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        if (this._page && this._limit) {
            const skipCount = (Number(this._page) - 1) * Number(this._limit);
            this.query.skip(skipCount);
        }

        if (this._limit) {
            this.query.limit(Number(this._limit));
        }
        return this;
    }

    async paginateWithValidation() {
        if (this._page && this._limit) {
            const skipCount = (Number(this._page) - 1) * Number(this._limit);

            const toursCount = await this.Model.countDocuments();
            if (skipCount >= toursCount) {
                throw new Error("This page does not exist");
            } else this.query.skip(skipCount);
        }

        if (this._limit) {
            this.query.limit(Number(this._limit));
        }
        return this;
    }
};
