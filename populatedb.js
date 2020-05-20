#! /usr/bin/env node

console.log('This script populates some succulents, types, categories and instances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Category = require('./models/category');
const PlantType = require('./models/planttype');
const Succulent = require('./models/succulent');
const SucculentInstance = require('./models/succulentinstance');


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let categories = [];
let plantTypes = [];
let succulents = [];
let succulentinstances = [];

function categoryCreate(name, cb) {
  
  const category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function plantTypeCreate(name, cb) {

  const plantType = new PlantType({ name: name });
       
  plantType.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Plant Type: ' + plantType);
    plantTypes.push(plantType)
    cb(null, plantType);
  }   );
}

function succulentCreate(name, nickname, summary, sku, category, plantType, cb) {
  succulentdetail = { 
    name: name,
    nickname: nickname,
    summary: summary,
    sku: sku
  }

  if (category != false) succulentdetail.category = category;
  if (plantType != false) succulentdetail.plantType = plantType;
    
  const succulent = new Succulent(succulentdetail);    

  succulent.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Succulent: ' + succulent);
    succulents.push(succulent)
    cb(null, succulent)
  }  );
}


function succulentInstanceCreate(succulent, status, price, image ,cb) {
  succulentinstancedetail = { 
    succulent: succulent,
    price: price,
  }

  // if (succulent != false) succulentinstancedetail.succulent = succulent;    
  // if (price != false) succulentinstancedetail.price = price;
  if (status != false) succulentinstancedetail.status = status;
  if (image != false) succulentinstancedetail.image = image;
    
  const succulentinstance = new SucculentInstance(succulentinstancedetail);    
  succulentinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING SucculentInstance: ' + succulentinstance);
      cb(err, null)
      return
    }
    console.log('New Succulent Instance: ' + succulentinstance);
    succulentinstances.push(succulentinstance)
    cb(null, succulent)
  }  );
}


function createCategoryTypes(cb) {
    async.series([
        function(callback) {
          categoryCreate('Indoor Succulents', callback);
        },
        function(callback) {
          categoryCreate('Ground Cover Succulents', callback);
        },
        function(callback) {
          categoryCreate('Rock Garden Succulents', callback);
        },
        function(callback) {
          categoryCreate('Miniature Fairy Garden Succulents', callback);
        },
        function(callback) {
          categoryCreate('Hanging & Trailing Succulents', callback);
        },
        function(callback) {
          plantTypeCreate("Hardy", callback);
        },
        function(callback) {
          plantTypeCreate("Soft", callback);
        },
        function(callback) {
          plantTypeCreate("Rare & Unusual", callback);
        },
        function(callback) {
          plantTypeCreate("Beginner Friendly", callback);
        }
        ],
        // optional callback
        cb);
}


function createSucculents(cb) {
    async.parallel([
        function(callback) {
          succulentCreate('Senecio rowleyanus', 'String of Pearls', 'An all-time favorite for the way its bead-like leaves can cascade several feet.', 'SS1011' , categories[4], [plantTypes[1], plantTypes[3]], callback);
        },
        function(callback) {
          succulentCreate('Haworthia fasciata', 'Zebra Plant', 'Named for the distinctive white bumps that line the outside of its leaves.', 'SS3027' , categories[0], [plantTypes[0], plantTypes[3]], callback);
        },
        function(callback) {
          succulentCreate('Echeveria', 'Perle von Nurnberg', 'An old, classic hybrid that is well-loved for its pearlescent pink and purple tones that can shade to blue-green.', 'SS8062' , categories[0], [plantTypes[1], plantTypes[3]], callback);
        },
        function(callback) {
          succulentCreate('Fenestraria rhopalophylla', 'Baby Toes', 'Green, finger-like foliage grows in upright clusters.', 'SS5786' , categories[3], [plantTypes[1], plantTypes[2]], callback);
        },
        function(callback) {
          succulentCreate('Haworthia mutica', null, 'Striped, chunky green leaves form a loose rosette. Each leaf has a flat top with a translucent "leaf window" that lets sunlight into the leaf interior. With brighter light it can take on a copper or purple coloration.', 'SS1011' , categories[0], [plantTypes[1], plantTypes[2] ,plantTypes[3]], callback);
        },
        ],
        // optional callback
        cb);
}


function createSucculentInstances(cb) {
    async.parallel([
        function(callback) {
          succulentInstanceCreate(succulents[0], 'Available', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[1], 'Available', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[2], 'Out of Stock', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[3], 'Available', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[3], 'Reserved', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[3], 'Available', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[4], 'Reserved', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[4], 'Reserved', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[4], 'Available', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[0], 'Reserved', 5.99, null, callback)
        },
        function(callback) {
          succulentInstanceCreate(succulents[1], 'Available', 5.99, null, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createCategoryTypes,
    createSucculents,
    createSucculentInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('SUCCULENTinstances: '+ succulentinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



