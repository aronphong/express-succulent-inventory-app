const Succulent = require('../models/succulent');

const async = require('async');

exports.index = (req, res) => {
    // res.send('NOT IMPLEMENTED');

    async.parallel({
        succulent_count: (callback) => {
            Succulent.countDocuments({}, callback);
        }
    }, (err, results) => {
        res.render('index', { title: 'Succulent Inventory Home', error: err, data: results });
    }
    )
};

// display list of all succulents
exports.succulent_list = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display detail page of specific succulent
exports.succulent_detail = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display succulent create form on GET
exports.succulent_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succuelent create on POST
exports.succulent_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display succulent delete form on GET
exports.succulent_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succulent delete on POST
exports.succulent_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display succulent update form on GET
exports.succulent_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succuelent update on POST
exports.succulent_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};
