const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const tokenSchema = new mongoose.Schema({
    userId: {
        type:ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    token: {
       type: String, 
       require: true
    }
},
{timestamps: true});

module.exports = mongoose.model('Token', tokenSchema); 