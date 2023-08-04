const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        maxlength: 100,
        require: true
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
        require: true
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
    },
    startDate: {
        type: Date,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      }
},
{timestamps: true});

module.exports = mongoose.model('Product',productSchema);