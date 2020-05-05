const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SucculentInstanceSchema = new Schema(
    {
        succulent: {type: Schema.Types.ObjectId, ref: 'Succulent', required: true},
        status: {type: String, required: true, enum: ['Available', 'Reserved', 'Out of Stock'], default: 'Out of Stock'},
        price: {type: Number, default: 0.00}
    }
);

SucculentInstanceSchema
    .virtual('url')
    .get(function() {
        return '/catalog/inventory/' + this._id;
    });

module.exports = mongoose.model('SucculentInstance', SucculentInstanceSchema);