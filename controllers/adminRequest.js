const { request } = require('express');
const AdminRequest = require('../models/adminRequest');
const User = require('../models/user');
const user = require('../models/user');

//create a request to be a admin
exports.create = async (req,res) => {
    console.log(req.user)
   const request = new AdminRequest({user: req.user._id});
    await request.save().then(result => {
        res.json({success: 'Request Was Succesffully Sent'});
    }).catch(err => {
        res.status(403).json({error: 'Either A Request Was Already Sent or A Technical Error Occurred Please Try Again Later'});
    });
}

//get all user request 
exports.list = async (req,res) => {
    await AdminRequest.find()
        .populate('user')//specifing that populate the order field with just the name, _id ... from the user document
        .sort('-created')//this signifies that it should be sort by date created
        .exec().then(data => {
            res.json(data)
        }).catch(error => {
            res.status(403).json({error: "Could Not Find Users Request"})
        })
}
//change or accept the user request
exports.update = async (req,res) => {
    await User.findByIdAndUpdate(req.adminRequestId.user , { $set: {role: 1}}).then(
        res.send("Request Was Successfully Accepted")
    )  
}

//decline user request
exports.remove = async (req,res) => {
    await AdminRequest.findOneAndDelete({user: req.user._id})
    .then(res.send('Request Was Successfully Cancelled'))
    .catch(err => {
        res.status(403).json({error: "Could Not Cancel Request"})
    }) 
}

//set user request to the req object
exports.userRequestId =async (req, res,next, id) => {
    const requestId = await AdminRequest.findOne({user: id}).exec();
    if(requestId){
        req.adminRequestId = requestId
        next()
    }else{
        res.status(403).json({error: "You Are Not a User"})
    }
}

//middleware to delete request frome the adminrequest collection
exports.deleteUser =async (req, res,next) => {
    console.log(req.adminRequestId)
    await AdminRequest.findOneAndDelete({user: req.adminRequestId.user})
    .then(user => { next()})
    .catch(err => {
        console.log(err)
        return res.status(403).json({error: err})
    }) 
}