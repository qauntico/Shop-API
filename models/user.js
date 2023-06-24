const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    about: {
        type: String,
        require: false
    },
    role: {
        type: Number,
        default: 0,
    },
    history: {
        type: Array,
        default: []
    }
 
},
{timestamps: true});

module.exports = mongoose.model('User', userSchema);