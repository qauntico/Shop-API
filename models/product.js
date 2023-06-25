const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectId,
        //and you reference but the model name like y will get an error
        ref: 'Category', 
        require: true
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
        default: false
    }
},
{timestamps: true});

module.exports = mongoose.model('Product',productSchema);