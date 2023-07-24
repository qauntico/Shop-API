const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const adminRequestSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        require: true,
        unique: true
    }
},{timestamps: true})

module.exports = mongoose.model('AdminRequest',adminRequestSchema);