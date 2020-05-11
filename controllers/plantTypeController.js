const PlantType = require('../models/planttype');
const Succulent = require('../models/succulent');

const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// display list of all categorys
exports.type_list = (req, res, next) => {
    
    PlantType.find({}, 'name')
        .exec((err, list_planttype) => {
            if (err) next(err);
            res.render('type_list', { title: 'List of Plant Types', type_list: list_planttype });
        })
};

// display detail page of specific category
exports.type_detail = (req, res, next) => {
    
    PlantType.findById(req.params.id)
        .exec( (err, plant_detail) => {
            if (err) next(err);
            res.render('type_detail', { title: 'Plant Type Detail', detail: plant_detail });
        });
};

// display category create form on GET
exports.type_create_get = (req, res) => {
    res.render('type_form', { title: 'Create new Plant Type' });
};

// handle succuelent create on POST
exports.type_create_post = [

    // validate field
    body('name', 'Plant Type name must not be empty').trim().isLength({ min: 3}),

    // sanitize field
    sanitizeBody('name').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        const plantType = new PlantType({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render('type_form', { title: 'Create new Plant Type', errors: errors.array() });
            return;
        } else {
            //data from form is valid
            // check if plant type already exists
            PlantType.findOne({ 'name': req.body.name })
                .exec((err, found_planttype) => {
                    if (err) next(err);
                    if (found_planttype) {
                        // plant type exists, redirect
                        res.redirect(found_planttype.url);
                    } else {
                        plantType.save((err) => {
                            if (err) next(err);
                            res.redirect(plantType.url);
                        });
                    }
                });
        }
    }
];

// display category delete form on GET
exports.type_delete_get = (req, res, next) => {
    
    async.parallel({
        planttype: (callback) => {
            PlantType.findById(req.params.id)
                .exec(callback)
        },
        succulents: (callback) => {
            Succulent.find({ 'plantType': req.params.id })
                .exec(callback)
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.planttype === null) {
            res.redirect('/catalog/types')
        };

        // successful
        res.render('type_delete', { title: 'Delete Plant Type', type: results.planttype, succulents: results.succulents });
    }
    )
};

// handle category delete on POST
exports.type_delete_post = (req, res) => {
    
    // Assume the POST has valid id

    async.parallel({
        planttype: (callback) => {
            PlantType.findById(req.params.id)
                .exec(callback)
        },
        succulents: (callback) => {
            Succulent.find({ 'plantType': req.params.id })
                .exec(callback)
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.succulents.length > 0 ) {
            // planttype has linked succulents. Render in same was as GET
            res.render('type_delete', { title: 'Delete Plant Type', type: results.planttype, succulents: results.succulents });
        } else {
            // planttype has no linked succulents. Delete object and redirect
            PlantType.findByIdAndRemove(req.body.id, (err) => {
                if (err) next(err);
                res.redirect('/catalog/types');
            });
        }
    });
};

// display category update form on GET
exports.type_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succuelent update on POST
exports.type_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};
