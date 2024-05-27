const { Order } = require('../models/order');
const sendEmail = require('../utils/sendMail');
const User = require("../models/user")

exports.orderId =async (req, res, next, id) => {
    await Order.findById(id)
        .populate('products.product', 'name price')
        .exec().then(order => {
            req.order = order
        }).catch(err => {
            return res.status(400).json({error: err})
        }) ;
       next();
};


exports.create =async (req, res) => {
    req.body.order.user = req.user;
    const order = new Order(req.body.order);
    await order.save().then(data => {
        res.json(data)
    }).catch(error => {
        res.status(403).json({error: "could not create order"})
    })
};

exports.listOrders =async (req, res) => {
    await Order.find()
        .populate('user', '_id name address')//specifing that populate the order field with just the name, _id ... from the user document
        .sort('-created')//this signifies that it should be sort by date created
        .exec().then(data => {
            res.json(data)
        }).catch(error => {
            res.status(403).json({error: "could not find order"})
        })
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues);//.path('status') specifies that we want to access the schema definition of the status field in the Order schema
};

exports.updateOrderStatus = async (req, res) => {
    try {
        // const user = await User.findById(req.body.user).find();
        // const subject = "Update On Event Ticket";
        // const text = `Your Ticket Status Have Been Updated To ${req.body.status} Check In Your User Profile`;
        // await sendEmail(user[0].email, subject, text );
        const order = await Order.findByIdAndUpdate(req.body.orderId, { $set: { status: req.body.status } });
        if (order){
            return res.json(order)
        }
    } catch (error) {
        return res.status(400).json({
            error: error
        }) 
    }
};
