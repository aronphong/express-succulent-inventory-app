const SucculentInstance = require('../models/succulentinstance');
const Succulent = require('../models/succulent');

const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// display list of all categorys
exports.succulentinstance_list = (req, res, next) => {

    SucculentInstance.find()
      .populate('succulent')
      .exec((err, list_succulentinstances) => {
          if (err) next(err);
          res.render('inventory_list', { title: 'Current Inventory', inventory_list: list_succulentinstances });
      })
};

// display detail page of specific category
exports.succulentinstance_detail = (req, res, next) => {

    SucculentInstance.findById(req.params.id)
        .populate('succulent')
        .exec((err, instance_detail) => {
            if(err) next(err);
            if (instance_detail===null) {
                const err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }

            res.render('inventory_item_detail', { title: 'Item Detail', item: instance_detail });
        })
};

// display category create form on GET
exports.succulentinstance_create_get = (req, res, next) => {
    
    Succulent.find()
        .exec((err, succulents) => {
            if (err) next(err);
            res.render('inventory_form', { title: 'Create new Inventory Item', succulents: succulents });
        })

};

// handle succuelent create on POST
exports.succulentinstance_create_post = [

    // validate fields
    body('price', 'Item must be a number').trim().isInt(),

    // sanitize field
    sanitizeBody('price').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        const item = new SucculentInstance({
            succulent: req.body.name,
            status: req.body.status,
            price: req.body.price
        });

        if (!errors.isEmpty()) {
            Succulent.find({}, 'name')
                .exec((err, succulents) => {
                    if (err) next(err);
                    res.render('inventory_form', { title: 'Create new Inventory Item', succulents: succulents, selected_succulent: item.succulent._id , errors: errors.array() ,item: item});
                })
            return;
        } else {
            // data from form is valid
            item.save((err) => {
                if (err) next(err);

                // success, redirect to new item
                res.redirect(item.url);
            });
        }
    }
];

// display category delete form on GET
exports.succulentinstance_delete_get = (req, res, next) => {

    SucculentInstance.findById(req.params.id)
        .populate('succulent')
        .exec((err, item) => {
            if (err) next(err);
            res.render('inventory_item_delete', { title: 'Delete Item', item: item});
        });
};

// handle category delete on POST
exports.succulentinstance_delete_post = (req, res, next) => {
    
    SucculentInstance.findByIdAndRemove(req.body.id, (err) => {
        if (err) next(err); 
        // success, redirect to inventory page
        res.redirect('/catalog/inventory');
    });
};

// display category update form on GET
exports.succulentinstance_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succuelent update on POST
exports.succulentinstance_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};
