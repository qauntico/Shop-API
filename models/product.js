const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
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
      },
      location: {
        type: String,
        required: true,
      }
},
{timestamps: true});

module.exports = mongoose.model('Product',productSchema);