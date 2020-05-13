const Succulent = require('../models/succulent');
const SucculentInstance = require('../models/succulentinstance');
const PlantType = require('../models/planttype');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = (req, res) => {

    async.parallel({
        succulent_count: (callback) => {
            Succulent.countDocuments({}, callback);
        },
        succulent_instance_count: (callback) => {
            SucculentInstance.countDocuments({}, callback);
        },
        planttype_count: (callback) => {
            PlantType.countDocuments({}, callback);
        },
        category_count: (callback) => {
            Category.countDocuments({}, callback);
        }

    }, (err, results) => {
        res.render('index', { title: 'Succulent Inventory Home', error: err, data: results });
    }
    )
};

// display list of all succulents
exports.succulent_list = (req, res, next) => {

    Succulent.find({}, 'name nickname')
        .populate('category')
        .populate('plantType')
        .exec((err, list_succulents) => {
            if (err) next(err);
            res.render('succulent_list', { title: 'Succulent List', succulent_list: list_succulents });
        })
};

// display detail page of specific succulent
exports.succulent_detail = (req, res, next) => {
    
    Succulent.findById(req.params.id)
        .populate('category')
        .populate('plantType')
        .exec((err, detail_succulent) => {
            if (err) next(err);
            res.render('succulent_detail', { title: 'Succulent Detail', succulent: detail_succulent });
        })
};

// display succulent create form on GET
exports.succulent_create_get = (req, res, next) => {
    
    // get all types and categories, so we can add to succulent
    async.parallel({
        types: (callback) => {
            PlantType.find(callback)
        },
        categories: (callback) => {
            Category.find(callback)
        }
    }, (err, results) => {
        if (err) next(err)
        res.render('succulent_form', { title: 'Create Succulent', types: results.types, categories: results.categories });
    }
    )
};

// handle succuelent create on POST
exports.succulent_create_post = [

    // convert plant type to array
    (req, res, next) => {
        if (!(req.body.planttype instanceof Array)) {
            if (typeof req.body.planttype === 'undefined') {
                req.body.planttype = [];
            } else {
                req.body.planttype = new Array(req.body.planttype);
            };
        };
        next();
    },

    // validate fields
    body('name', 'Name must not be empty').trim().isLength( {min: 1}),
    body('summary', 'summary must not be empty').trim().isLength( {min: 1}),

    // sanitize fields
    sanitizeBody('*').escape(),
    sanitizeBody('planttype.*').escape(),

    // process request after validation and sanitization
    (req, res, next) => {

        // extract the validation errors from request
        const errors = validationResult(req);

        // create a new succulent object
        const succulent = new Succulent(
            {
                name: req.body.name,
                nickname: req.body.nickname,
                summary: req.body.summary,
                plantType: req.body.planttype,
                category: req.body.category
            }
        );

        if (!errors.isEmpty()) {
            // there are errors. render form again with sanitized values/error messages

            //  get all plant types and categories for form
            async.parallel({
                types: (callback) => {
                    PlantType.find(callback);
                },
                category: (callback) => {
                    Category.find(callback);
                }
            }, (err, results) => {
                if (err) next(err);
                res.render('succulent_form', { title: 'Create Succulent', errors: error, types: results.type, categories: results.category})
            });
        } else {
            // data from form is valid
            // save succulent
            succulent.save((err) => {
                if (err) next(err);
                // successful - redirect to new succulent record
                res.redirect(succulent.url);
            })
        }
    }
];

// display succulent delete form on GET
exports.succulent_delete_get = (req, res, next) => {
    
    async.parallel({
        succulent: (callback) => {
            Succulent.findById(req.params.id)
                .populate('plantType')
                .populate('category')
                .exec(callback);
        },
        succulentinstances: (callback) => {
            SucculentInstance.find({ 'succulent': req.params.id })
                .populate('succulent')
                .exec(callback);
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.succulent === null) {
            res.redirect('/catalog/succulents');
        };
        
        //successful
        res.render('succulent_delete', { title: 'Delete Succulent', succulent: results.succulent, succulent_instances: results.succulentinstances });
    });
};

// handle succulent delete on POST
exports.succulent_delete_post = (req, res, next) => {
    
    // Assume the POST has valid id

    async.parallel({
        succulent: (callback) => {
            Succulent.findById(req.body.id)
                .exec(callback)
        },
        succulentinstances: (callback) => {
            SucculentInstance.find({ 'succulent': req.body.id })
                .populate('succulent')
                .exec(callback)
        }
    }, (err, results) => {
        if (err) next(err);
        if (results.succulentinstances.length > 0) {
            // succulent has instances. Render in the same was as GET
            res.render('succulent_delete', { title: 'Delete Succulent', succulent: results.succulent, succulent_instances: results.succulentinstances });
        } 
        else {
            // Succulent has no instances. Delete object and redirect
            Succulent.findByIdAndRemove(req.body.id, (err) => {
                if (err) next(err);
                res.redirect('/catalog/succulents');
            });
        }
    });
};

// display succulent update form on GET
exports.succulent_update_get = (req, res, next) => {
    
   async.parallel({
       succulent: (callback) => {
           Succulent.findById(req.params.id).populate('category').populate('plantType').exec(callback);
       },
       category: (callback) => {
           Category.find(callback);
       },
       plantType: (callback) => {
           PlantType.find(callback);
       }
   }, (err, results) => {
       if (err) next(err);
       if (results.succulent===null) {
           const err = new Error('Succulent not Found')
           err.status = 404;
           return next(err);
       }

       // mark selected plant types as checked
       for (let i = 0; i < results.plantType.length; i++) {
           for (let j = 0; j < results.succulent.plantType.length; j++) {
               // compare model plant type ID to item plant type ID
               if (results.plantType[i]._id.toString() === results.succulent.plantType[j]._id.toString()) {
                   results.plantType[i].checked='true'
               }
           }
       }
       res.render('succulent_form', { title: 'Update Succulent', succulent: results.succulent, categories: results.category, types: results.plantType });
   });
};

// handle succuelent update on POST
exports.succulent_update_post = [

    // validate fields
    body('name', 'Succulent name must not be empty').trim().isLength({ min: 3}),
    body('nickname').trim().isLength({ min: 0 }),
    body('summary', 'Succulent summary must not be empty').trim().isLength({ min: 3 }),

    // sanitize fields
    sanitizeBody('name').escape(),
    sanitizeBody('nickname'),
    sanitizeBody('planttype.*').escape(),
    sanitizeBody('nickname').escape(),
    sanitizeBody('summary').escape(),

    (req, res, next) => {

        // extract errors from request
        const errors = validationResult(req);

        //create new succulent object
        const succulent = new Succulent({
            name: req.body.name,
            nickname: req.body.nickname,
            summary: req.body.summary,
            sku: req.body.sku,
            plantType: (typeof req.body.planttype === 'undefined') ? [] : req.body.planttype,
            category: req.body.category,
            _id: req.params.id // reqiuired or new id will be assigned
        });

        if (!errors.isEmpty()) {
            // there are errors. render form again with sanitized values / error messages

            async.parallel({
                types: (callback) => {
                    PlantType.find(callback)
                },
                categories: (callback) => {
                    Category.find(callback)
                }
            }, (err, results) => {
                if (err) next(err);

                // mark selected genres as checked
                for (let i = 0; i < results.types.length; i++) {
                    if (succulent.plantType.indexOf(results.types[i]._id) > -1) {
                        results.types[i].checked = 'true';
                    }
                };

                res.render('succulent_form', { title: 'Update Succulent', succulent: succulent,types: results.types, categories: results.categories, errors: errors.array() });
            });
            return;
        } else {
            // data from form is valid. update record

            Succulent.findByIdAndUpdate(req.params.id, succulent, {}, (err, thesucculent) => {
                if (err) next(err);
                // success
                res.redirect(thesucculent.url);
            })

        }
    }
]
