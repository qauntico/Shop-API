const User = require('../models/user');
const bcrypt = require('bcrypt');

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