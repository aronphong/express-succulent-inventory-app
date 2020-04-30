const express = rerquire('express');
const router = express.Router();

// require controller modules
const succulent_controller = require('../controllers/succulentController');
const category_controller = require('../controllers/categoryController');
const plant_type_controller = require('../controllers/plantTypeController');
const succulent_instance_controller = require('../controllers/succulentinstanceController');

/// SUCCULENT ROUTES ///

// GET catalog home page
router.get('/', succulent_controller.index);

// GET request for creating a succulent
router.get('/succulent/create', succulent_controller.succulent_create_get);

// POST request for crerating a succulent
router.post('/succulent/create', succulent_controller.succulent_create_post);

// GET reqyest for deleting a succulent
router.get('/succulent/delete', succulent_controller.succulent_delete_get);

// POST request for deleting a succulent
router.post('/succulent/delete', succulent_controller.succulent_delete_post);

// GET request for updating a succulent
router.get('/succulent/update', succulent_controller.succulent_update_get);

// POST request for updating a succulent
router.post('/succulent/update', succulent_controller.succulent_update_post);

// GET request for one succulent
router.get('/succulent/:id', succulent_controller.succulent_detail);

// GET request for list of all succulent items
router.get('/succulents', succulent_controller.succulent_list);

/// CATEGORY ROUTES ///

// GET request for creating a category
router.get('/category/create', category_controller.category_create_get);

// POST request for crerating a category
router.post('/category/create', category_controller.category_create_post);

// GET reqyest for deleting a category
router.get('/category/delete', category_controller.category_delete_get);

// POST request for deleting a category
router.post('/category/delete', category_controller.category_delete_post);

// GET request for updating a category
router.get('/category/update', category_controller.category_update_get);

// POST request for updating a category
router.post('/category/update', category_controller.category_update_post);

// GET request for one category
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category items
router.get('/categories', category_controller.category_list);

/// PLANT TYPE ROUTES ///

// GET request for creating a category
router.get('/type/create', plant_type_controller.type_create_get);

// POST request for crerating a category
router.post('/type/create', plant_type_controller.type_create_post);

// GET reqyest for deleting a category
router.get('/type/delete', plant_type_controller.type_delete_get);

// POST request for deleting a category
router.post('/type/delete', plant_type_controller.type_delete_post);

// GET request for updating a category
router.get('/type/update', plant_type_controller.type_update_get);

// POST request for updating a category
router.post('/type/update', plant_type_controller.type_update_post);

// GET request for one category
router.get('/type/:id', plant_type_controller.type_detail);

// GET request for list of all category items
router.get('/types', plant_type_controller.type_list);

/// SUCCULENT INSTANCE ROUTES ///

// GET request for creating a category
router.get('/inventory/create', succulent_instance_controller.succulentinstance_create_get);

// POST request for crerating a category
router.post('/inventory/create', succulent_instance_controller.succulentinstance_create_post);

// GET reqyest for deleting a category
router.get('/inventory/delete', succulent_instance_controller.succulentinstance_delete_get);

// POST request for deleting a category
router.post('/inventory/delete', succulent_instance_controller.succulentinstance_delete_post);

// GET request for updating a category
router.get('/inventory/update', succulent_instance_controller.succulentinstance_update_get);

// POST request for updating a category
router.post('/inventory/update', succulent_instance_controller.succulentinstance_update_post);

// GET request for one category
router.get('/inventory/:id', succulent_instance_controller.succulentinstance_detail);

// GET request for list of all category items
router.get('/inventory', succulent_instance_controller.succulentinstance_list);


module.exports = router;
