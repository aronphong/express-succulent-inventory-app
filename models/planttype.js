const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlantTypeSchema = new Schema(
    {
        name: {type: String, required: true, min: 3, max: 100}
    }
);

PlantTypeSchema
    .virtual('url')
    .get(function() {
        return '/catalog/planttype/' + this._id;
    });

module.exports = mongoose.model('PlantType', PlantTypeSchema);