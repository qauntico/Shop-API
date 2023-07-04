const User = require('../models/user');
const bcrypt = require('bcrypt');
const {  validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {expressjwt: jwts }  = require('express-jwt');


exports.signup = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };
    console.log(req.body)
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
                    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
                    res.cookie('myCookie', token, {expire: new Date() + 9999});
                    user.password = undefined
                    return res.json({token, user: user })
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
//logout the user 
exports.logout = (req,res) => {
    res.clearCookie('myCookie');
    res.send("user was successfully logout");
};
//add the user into the request object
exports.userId = async (req,res,next, id) => {
    const user = await User.findOne({_id: id}).exec();
    if(user){
        req.user = user
        next()
    }else{
        res.status(403).json({error: "could not find user"})
    }
};

exports.isAdmin = async (req,res,next) => {
    console.log(req.user.role)
    if(req.user.role === 1 ){
        next()
    }else{
        res.status(403).json({error: "you are not authorized to perform this operation"});
    };
};
exports.isRegistered = async (req,res,next) => {
    console.log("yes i run")
    await User.findById(req.user._id).exec().then(
        next()
    ).catch(err => {
        res.status(403).json({error: "you are not a user"});
    })
};

exports.authentication = jwts({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
  });
