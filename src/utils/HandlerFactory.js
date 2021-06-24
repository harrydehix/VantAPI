const AppError = require("../errorHandling/AppError");
const catchAsync = require("../errorHandling/catchAsync");
const filter = require("./filter");
const applyAPIFeatures = require("./applyAPIFeatures");

class HandlerFactory {
    constructor(Model) {
        this.Model = Model;
        this.name = {};
        this.name.singular = Model.modelName.toLowerCase();
        this.name.plural = `${this.name.singular}s`;
    }

    /**
     * Factory function for deleting an item of a single collection.
     * @param {Object} options Object holding additional custom options.
     * @param {Function} options.setId Allows you to change where to get the documents id from (default is req.params.id).
     * @param {Boolean} options.showVersionKey Shows the version key (__v) if enabled.
     * @param {*} options.select Allows you to (un)select particular fields.
     * @param {Function} options.beforeAwaitingQuery Middleware allowing you to manipulate the query before awaiting it.
     * @param {Function} options.afterDocumentDeletion Middleware allowing you to access the document after deletion.
     * @param {Function} options.sendCustom Allows you to send a custom answer to the client.
     */
    deleteOne(options) {
        options = { ...options };
        return catchAsync(async (req, res) => {
            // Get documents id
            let id;
            if (options.setId) id = options.setId(req);
            else id = req.params.id;

            // Build query
            let query = this.Model.findByIdAndDelete(id);

            // Hide/Show version key
            if (!options.showVersionKey) query = query.select("-__v");

            // Select custom fields
            if (options.select) query = query.select(options.select);

            // Middleware before awaiting query
            if (options.beforeAwaitingQuery)
                query = options.beforeAwaitingQuery(query);

            // Await query
            let doc = await query;

            // Raise error if no document was found
            if (!doc)
                throw new AppError(
                    `Invalid ${this.name.singular} id (${req.params.id})`,
                    401
                );

            // Middleware after document deletion
            if (options.afterDocumentDeletion)
                doc = options.afterDocumentDeletion(doc);

            // Send answer to client
            if (options.sendCustom) return options.send(req, res, doc);
            res.status(204).json({ status: "success", data: null });
        });
    }

    /**
     * Factory function for updating an item of a single collection.
     * @param {Object} options Object holding additional custom options.
     * @param {Function} options.setBody Allows you to change where to get the document's new body from (default is req.body).
     * @param {Object|String} options.filterBody Allows you to securely filter the document's new body (using string or object structure).
     * @param {Function} options.setId Allows you to change where to get the documents id from (default is req.params.id).
     * @param {Boolean} options.showVersionKey Shows the version key (__v) if enabled.
     * @param {*} options.select Allows you to (un)select particular fields.
     * @param {Function} options.beforeDocumentUpdate Middleware allowing you to manipulate/access the document before it gets updated in the database.
     * @param {Function} options.afterDocumentUpdate Middleware allowing you to manipulate/access the document after it gets updated in the database.
     * @param {Object|String} options.filterDocBeforeSend Allows you to filter the already updated document to send it accordingly to the client (using string or object structure). Only use this if you cannot use 'options.select'.
     * @param {Function} options.sendCustom Allows you to send a custom answer to the client.
     */
    updateOne(options) {
        options = { ...options };
        return catchAsync(async (req, res) => {
            // Get update body
            let body;
            if (options.setBody) body = options.setBody(req);
            else body = req.body;

            // Filter update body
            if (options.filterBody) body = filter(body, options.filterBody);

            // Get document's id
            let id;
            if (options.setId) id = options.setId(req);
            else id = req.params.id;

            // Query document
            let query = this.Model.findById(id);

            // Select custom fields
            if (options.select) query = query.select(options.select);
            let doc = await query;

            // Raise error if no document was found
            if (!doc)
                throw new AppError(
                    `Invalid ${this.name.singular} id (${id})`,
                    400
                );
            // Update document in ram
            Object.assign(doc, body);

            // Middleware before document update in database
            if (options.beforeDocumentUpdate)
                doc = options.beforeDocumentUpdate(doc);

            // Update document in database
            await doc.save();

            // Middleware after document update in database
            if (options.afterDocumentUpdate)
                doc = options.afterDocumentUpdate(doc);

            // Hide/Show version key
            if (!options.showVersionKey) doc.__v = undefined;

            // Filter the saved doc
            if (options.filterDocBeforeSend)
                doc = filter(doc, options.filterDocBeforeSend);

            // Send answer to client
            if (options.sendCustom) return options.sendCustom(req, res, doc);
            res.status(201).json({
                status: "success",
                data: {
                    [this.name.singular]: doc,
                },
            });
        });
    }

    /**
     * Factory function for creating an item of a single collection.
     * @param {Object} options Object holding additional custom options.
     * @param {Function} options.setBody Allows you to change where to get the document's body from (default is req.body).
     * @param {Object|String} options.filterBody Allows you to securely filter the document's new body (using string or object structure).
     * @param {Function} options.setId Allows you to change where to get the document's id from (default is req.params.id).
     * @param {Function} options.beforeDocumentSave Middleware allowing you to manipulate/access the document before it gets stored in the database.
     * @param {Boolean} options.showVersionKey Shows the version key (__v) if enabled.
     * @param {Function} options.afterDocumentSave Middleware allowing you to manipulate/access the document after it gets stored in the database.
     * @param {Object|String} options.filterDocBeforeSend Allows you to filter the already created document to send it accordingly to the client (using string or object structure).
     * @param {Function} options.sendCustom Allows you to send a custom answer to the client.
     */
    createOne(options) {
        options = { ...options };
        return catchAsync(async (req, res) => {
            // Get body
            let body;
            if (options.setBody) body = options.setBody(req);
            else body = req.body;

            // Filter body
            if (options.filterBody) body = filter(body, options.filterBody);

            // Create document in ram
            let doc = new this.Model(body);

            // Middleware before the documents get stored in the database
            if (options.beforeDocumentSave)
                doc = options.beforeDocumentSave(doc);

            // Store document in database
            await doc.save();

            // Middleware after the document got stored in the database
            if (options.afterDocumentSave) doc = options.afterDocumentSave(doc);

            // Hide/Show version key
            if (!options.showVersionKey) doc.__v = undefined;

            // Filter the saved doc
            if (options.filterDocBeforeSend)
                doc = filter(doc, options.filterDocBeforeSend);

            // Send answer to client
            if (options.sendCustom) return options.sendCustom(req, res, doc);
            res.status(201).json({
                status: "success",
                data: { [this.name.singular]: doc },
            });
        });
    }

    /**
     * Factory function for getting an item from a single collection.
     * @param {Object} options Object holding additional custom options.
     * @param {Function} options.setId Allows you to change where to get the document's id from (default is req.params.id).
     * @param {Function} options.beforeAwaitingQuery Middleware allowing you to manipulate/access the query before it gets executed.
     * @param {Boolean} options.showVersionKey Shows the version key (__v) if enabled.
     * @param {*} options.select Allows you to (un)select particular fields.
     * @param {Function} options.afterQueryingDoc Middleware allowing you to manipulate/access the document after it got queried from the database.
     * @param {Object|String} options.filterDocBeforeSend Allows you to filter the document to send it accordingly to the client (using string or object structure). Only use this if you cannot use 'options.select'.
     * @param {Function} options.sendCustom Allows you to send a custom answer to the client.
     */
    getOne(options) {
        options = { ...options };
        return catchAsync(async (req, res) => {
            // Get document's id
            let id;
            if (options.setId) id = options.setId(req);
            else id = req.params.id;

            // Build query
            let query = this.Model.findById(id);

            // Middleware before awaiting query
            if (query.beforeAwaitingQuery)
                query = options.beforeAwaitingQuery(req);

            // Show/Hide version key
            if (!options.showVersionKey) query = query.select("-__v");

            // (Un)select particular fields
            if (options.select) query = query.select(options.select);

            // Execute the query
            let doc = await query;

            // Raise error if no document was found
            if (!doc)
                throw new AppError(
                    `Invalid ${this.name.singular} id (${req.params.id})`,
                    401
                );

            // Middleware after querying the doc
            if (options.afterQueryingDoc) doc = options.afterQueryingDoc(doc);

            // Filter the doc before sending it
            if (options.filterDocBeforeSend)
                doc = filter(doc, options.filterDocBeforeSend);

            // Send answer to client
            if (options.sendCustom) return options.sendCustom(req, res, doc);
            res.status(200).json({
                status: "success",
                data: {
                    [this.name.singular]: doc,
                },
            });
        });
    }

    /**
     * Factory function for getting many items of a single collection.
     * @param {Object} options Object holding additional custom options.
     * @param {*} options.filterObject Allows you to filter the docs using a common filter object.
     * @param {Boolean} options.useAPIFeatures Enables filtering, sorting, paginating and limiting for the client.
     * @param {Function} options.beforeAwaitingQuery Middleware allowing you to access/manipulate the query before awaiting it.
     * @param {Boolean} options.showVersionKey Shows the version key (__v) if enabled.
     * @param {*} options.select Allows you to (un)select particular fields.
     * @param {Function} options.afterQueryingDocs Middleware allowing you to access/manipulate the array holding all docs after the query was awaited.
     * @param {Function} options.sendCustom Allows you to write a custom answer to the client.
     */
    getMany(options) {
        options = { ...options };
        return catchAsync(async (req, res) => {
            // Build query
            let query;

            // Filter docs using common filter object
            if (options.filterObject)
                query = this.Model.find(options.filterObject);
            else query = this.Model.find({});

            // Show/Hide version key (seoond part bc of a bug, __v is needed to apply the fields api features)
            if (!options.showVersionKey && !req.query.fields)
                query = query.select("-__v");

            // Use API features if enabled
            if (options.useAPIFeatures) {
                query = applyAPIFeatures(req, query);
            }

            // Middleware before awaiting query
            if (options.beforeAwaitingQuery)
                query = options.beforeAwaitingQuery(query);

            // (Un)select particular fields
            if (options.select) query = query.select(options.select);

            // Execute query
            let docs = await query;

            // Middleware after querying the documents
            if (options.afterQueryingDocs)
                docs = options.afterQueryingDocs(docs);

            // Send answer to client
            if (options.sendCustom) return options.sendCustom(req, res, docs);
            res.status(200).json({
                status: "success",
                results: docs.length,
                data: {
                    [this.name.plural]: docs,
                },
            });
        });
    }

    /**
     * Factory function for deleting many items of a single collection.
     * @param {Object} options Object holding additional custom options.
     * @param {*} options.filterObject Allows you to filter the docs using a common filter object.
     * @param {Function} options.beforeAwaitingQuery Middleware allowing you to access/manipulate the query before awaiting it.
     * @param {Function} options.afterDeletingDocs Middleware allowing you to access/manipulate information about the deletion process after the query was awaited.
     * @param {Function} options.sendCustom Allows you to write a custom answer to the client.
     */
    deleteMany(options) {
        options = { ...options };
        return catchAsync(async (req, res) => {
            // Build query
            let query;

            // Filter docs using common filter object
            if (options.filterObject)
                query = this.Model.deleteMany(options.filterObject);
            else query = this.Model.deleteMany({});

            // Middleware before awaiting query
            if (options.beforeAwaitingQuery)
                query = options.beforeAwaitingQuery(query);

            // Execute query
            let docs = await query;

            // Middleware after querying the documents
            if (options.afterDeletingDocs)
                docs = options.afterDeletingDocs(docs);

            // Send answer to client
            if (options.sendCustom) return options.sendCustom(req, res, docs);
            res.status(200).json({
                status: "success",
                results: docs.deletedCount,
                data: null,
            });
        });
    }
}
module.exports = HandlerFactory;
