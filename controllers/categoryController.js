const Succulent = require('../models/succulent');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
exports.category_create_post = [

    //validate field
    body('name', 'Category name must not be empty').trim().isLength({ min: 3 }),
    
    //sanitize field
    sanitizeBody('name').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        const category = new Category({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render('category_form', { title: 'New Category', errors: errors.array() });
            return;
        } else {
            // data from form is valid
            // check if category already exists
            Category.findOne({ 'name': req.body.name })
                .exec((err, found_category) => {
                    if (err) next(err);

                    if (found_category) {
                        // category exists, redirect to page
                        res.redirect(found_category.url);
                    } else {
                        category.save((err) => {
                            if (err) next(err);
                            res.redirect(category.url);
                        });
                    }
                });
        }
    }
];

// display category delete form on GET
exports.category_delete_get = (req, res, next) => {
    
    async.parallel({
        category: (callback) => {
            Category.findById(req.params.id)
                .exec(callback);
        },
        succulents: (callback) => {
            Succulent.find({ 'category': req.params.id })
                .exec(callback);
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.category === null ) {
            res.redirect('/catalog/categories');
        };

        // successful 
        res.render('category_delete', { title: 'Delete Category', category: results.category, succulents: results.succulents });
    }
    )
};

// handle category delete on POST
exports.category_delete_post = (req, res, next) => {
    
    // Assume the POST has valid id

    async.parallel({
        category: (callback) => {
            Category.findById(req.body.id)
                .exec(callback)
        },
        succulents: (callback) => {
            Succulent.find({ 'category': req.body.id })
                .exec(callback)
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.succulents.length > 0) {
            // category has linked succulents. Render in same was as GET
            res.render('category_delete', { title: 'Delete Category', category: results.category, succulents: results.succulents });
        } else {
            // Category has no linked succulents. Delete object and redirect
            Category.findByIdAndRemove(req.body.id, (err) => {
                if (err) next(err);
                res.render('/catalog/categories');
            });
        }
    });
};

// display category update form on GET
exports.category_update_get = (req, res) => {

    Category.findById(req.params.id)
        .exec((err, category) => {
            if (err) next(err);
            res.render('category_form', { title: 'Update Category', category: category });
        });
};

// handle succuelent update on POST
exports.category_update_post = [

    // validate field
    body('name', 'Category name must not be empty').trim().isLength({ min: 1 }),

    // sanitize field
    sanitizeBody('name').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        // create category with escaped/trimmed data and old id
        const category = new Category({ 
            name: req.body.name,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // there are errors. render form again with sanitized value / error message
            Category.findById(req.params.id)
                .exec((err, category) => {
                    if (err) next(err);
                    res.render('category_form', { title: 'Update Category', category: category})
                })
        } else {
            // data from form is valid. save and redirect
            Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
                if (err) next(err);
                res.redirect(thecategory.url);
            })
        }
    }

];
