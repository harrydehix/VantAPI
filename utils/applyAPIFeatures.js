module.exports = (req, query) => {
    const {
        page,
        limit: size,
        sort: sortString,
        fields: selectString,
    } = req.query;
    const filterObj = prepareFilterObject(req);
    if (filterObj) query = filter(query, filterObj);
    if (sortString) query = sort(query, sortString);
    if (selectString) query = select(query, selectString);
    if (page && size) query = paginate(query, size, page);
    else if (size !== undefined) query = limit(query, size);

    return query;
};

function prepareFilterObject(req) {
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete req.query[el]);

    const queryString = JSON.stringify(req.query).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
    );
    return JSON.parse(queryString);
}

function filter(query, filterObj) {
    return query.find(filterObj);
}

function sort(query, sortString) {
    sortString = sortString.replace(/,/g, " ");
    return query.sort(sortString);
}

function select(query, selectString) {
    selectString = selectString.replace(/,/g, " ");
    return query.select(selectString);
}

function paginate(query, size, page) {
    const skipCount = (Number(page) - 1) * Number(size);
    return query.skip(skipCount).limit(size);
}

function limit(query, size) {
    return query.limit(Number(size));
}
