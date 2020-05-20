const SucculentInstance = require('../models/succulentinstance');
const Succulent = require('../models/succulent');

const async = require('async');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

            let img = null;
            if (instance_detail.image.data) {

                // if image exists in instace, encode buffer data to base64
                img = `data:${instance_detail.image.contentType};base64, ${instance_detail.image.data.toString('base64')}`
            }   
            
            res.render('inventory_item_detail', { title: 'Item Detail', item: instance_detail, image: img });
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

    // upload image to ./uploads/
    upload.single('itemimage'),

    // validate fields
    body('price', 'Item must be a number').trim().isInt(),

    // sanitize field
    sanitizeBody('price').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        const item = new SucculentInstance({
            succulent: req.body.name,
            status: req.body.status,
            price: req.body.price,
            // image: fs.readFileSync(req.file.path),
        });

        if (req.file) {
            
            // if file uploaded, encode image data
            item.image.data = fs.readFileSync(req.file.path);
            item.image.contentType = req.file.mimetype;
        }


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
exports.succulentinstance_update_get = (req, res, next) => {
    
    async.parallel({
        item: (callback) => {
            SucculentInstance.findById(req.params.id).exec(callback);
        },
        succulents: (callback) => {
            Succulent.find(callback);
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.succulentinstance===null) {
            const err = new Error('Succulent not Found');
            err.status = 404;
            return next(err);
        }
        // success
        res.render('inventory_form', { title: 'Update Item Information', item: results.item, succulents: results.succulents });
    });
};

// handle succuelent update on POST
exports.succulentinstance_update_post = [

    body('price', 'Item Price must be numeric').trim().isNumeric(),

    sanitizeBody('price').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        const item = new SucculentInstance({
            succulent: req.body.succulent,
            status: req.body.status,
            price: req.body.price,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {

            Succulent.find({}, 'name')
                .exec((err, succulents) => {
                    if (err) next(err);
                    res.render('inventory_form', { title: 'Update Item Information', item: item, succulents: succulents, errors: errors.array() });
                });
        } else {

            SucculentInstance.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
                if (err) next(err);
                res.redirect(theitem.url);
            });
        }
    }
];