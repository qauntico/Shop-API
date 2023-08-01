const User = require('../models/user');
const bcrypt = require('bcrypt');
const {Order} = require('../models/order');
const {errorHandler } = require('../Helpers/errorhandler');

exports.read =async (req,res) => {
    try{
        const user = await User.findById(req.user._id).exec();
        if(user){
            res.send(user);
        }else{
            res.status(403).json({error: "user was not found"});
        }
    }catch(err){
        res.status(403).json({err: "An error occured in the process"});
    };
    
};
exports.list = async (req,res) => {
    await User.find({}).then(user => {
        res.send(user);
    }).catch(err => {
        res.status(403).json({error: "An error occured"});
    })
};

exports.update = async (req,res) => {
    if(req.body.password){
        const password = Number(req.body.password.length)
        if(password >= 6){
            const salt = Number(process.env.SALTROUNDS)
            bcrypt.hash(req.body.password, salt,async function(err, hash) {
                req.body.password = hash
                await User.findByIdAndUpdate(req.user._id, { $set: req.body}).then(
                    res.send("user was successfull updated")
                )
            })
        }else{
            return res.status(403).json({error: "you password length is too short"})
        };
        
    }else{
        await User.findByIdAndUpdate(req.user._id, { $set: req.body}).then(
            res.send("user have been update")
        )
    }
};

exports.remove = async (req,res) => {
    await User.findOneAndDelete({name: req.user.name})
        .then(res.send('this was a success'))
        .catch(err => {
            res.status(403).json({error: "user was not deleted"})
        })
};

exports.addOrderToUserHistory = async (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });
    //by using new true we are telling mongoose to return the new updated documents after the update and not the previous document before the update
    //becuase by default when mongoose updates a document it returns the document before the update and not the recent document
    await User.findOneAndUpdate({ _id: req.user._id }, { $push: { history: history } }, { new: true }).catch(error => {
        res.status(403).json({error: 'could not update the document'});
    })
    next();
};

//user purchase history
exports.purchaseHistory = async  (req, res) => {
    await Order.find({ user: req.user._id })
            .populate('user', '_id name')
            .sort('-created')
            .exec().then(orders => {
                res.json(orders);
            }).catch(err => {
                return res.status(403).json({error: errorHandler(err)});
            });
};
