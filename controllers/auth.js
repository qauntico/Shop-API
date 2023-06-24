const User = require('../models/user');
const bcrypt = require('bcrypt');
const {  validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.signup = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ errors: errors.array() });
    };
    const salt = Number(process.env.SALTROUNDS);
    bcrypt.hash(req.body.password, salt,async function(err, hash) {
        if(err){
            res.status(403).json({err: err})
        }else{
            const newUser = new User({...req.body,["password"]: hash});
            await newUser.save().then(user => {
                user.password = undefined
                res.send(user);
            });
        };    
    });
};

exports.signin = async (req,res) => {
    const username = req.body.email;
    const password = req.body.password;
    console.log(username)
    const user = await User.findOne({email: username}).exec();
    if (user) {
        bcrypt.compare(password, user.password, function(err, result) {
            if(!err){
                if(result){
                    
                }else{
                    res.status(403).json({error:'incorrect password sir'});
                }
            }else{
                res.status(403).json({error: err})
            }
            
        });
    }else{
        res.status(400).json({error: "user was not found"})
    }
   
}
