const Succulent = require('../models/succulent');
const Category = require('../models/category');

const async = require('async');

// display list of all categorys
exports.category_list = (req, res, next) => {
    
    Category.find({})
      .exec((err, list_category) => {
          if (err) next(err);
          res.render('category_list', { title: 'Category List', category_list: list_category });
      })
};

// display detail page of specific category
exports.category_detail = (req, res, next) => {
    
    Category.findById(req.params.id)
        .exec((err, category_detail) => {
            if (err) next(err);
            res.render('category_detail', { title: 'Category Detail', detail: category_detail });
        })
};

// display category create form on GET
exports.category_create_get = (req, res) => {
    res.render('category_form', { title: 'New Category' });
};

// handle succuelent create on POST
exports.category_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display category delete form on GET
exports.category_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle category delete on POST
exports.category_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display category update form on GET
exports.category_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succuelent update on POST
exports.category_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};
