const PlantType = require('../models/planttype');
const async = require('async');

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
    res.send('NOT IMPLEMENTED');
};

// handle succuelent create on POST
exports.type_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display category delete form on GET
exports.type_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle category delete on POST
exports.type_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// display category update form on GET
exports.type_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED');
};

// handle succuelent update on POST
exports.type_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED');
};
