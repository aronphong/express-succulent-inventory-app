const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const succulentSchema = new Schema(
    {
        name: {type: String, required: true},
        nickname: {type: String},
        summary: {type: String, required: true},
        sku: {type: String, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        plantType: [{type: Schema.Types.ObjectId, ref: 'PlantType', required: true}]
    }
);

// virtual for succulent;s URL
succulentSchema
    .virtual('url')
    .get(function() {
        return '/catalog/succulent/' + this._id;
    });

// export model
module.exports = mongoose.model('Succulent', succulentSchema);