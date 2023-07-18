const User = require('../models/user');
const bcrypt = require('bcrypt');
const {  validationResult } = require('express-validator');//handle field validation for complete data entry
const jwt = require('jsonwebtoken');
const {expressjwt: jwts }  = require('express-jwt');
const {errorHandler,customValidatorError } = require('../Helpers/errorhandler');//error handler methods

//user signup controller
exports.signup = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: customValidatorError(errors.array()) });
    };
    const salt = Number(process.env.SALTROUNDS);
    bcrypt.hash(req.body.password, salt,async function(err, hash) {
        if(err){
            res.status(400).json({error: errorHandler(err)})
        }else{
            const newUser = new User({...req.body,["password"]: hash});
            await newUser.save().then(user => {
                user.password = undefined
                res.send(user);
            }).catch(err => {
                console.log(err)//checking saving error from the developer site
                return res.status(400).json({error: "Either The Email You Trying To Save Already Exist Or You Have Entered a Wrong Value SomeWhere"});
            });
        };    
    });
};

//signin a user 
exports.signin = async (req,res) => {
    console.log(req.body)
    const username = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: username}).exec();//check if user exist 
    if (user) {
        bcrypt.compare(password, user.password, function(err, result) {
            if(!err){
                if(result){
                    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn: '2d'});
                    res.cookie('myCookie', token, {expire: new Date() + 9999});
                    user.password = undefined
                    return res.json({token, user: user })
                }else{
                    res.status(403).json({error:'incorrect password sir'});
                }
            }else{
                res.status(403).json({error: errorHandler(err)})
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
        res.status(403).json({error: "You Are Not a User"})
    }
};

//check if user is admin first
exports.isAdmin = async (req,res,next) => {
    if(req.user.role === 1 ){
        next()
    }else{
        res.status(403).json({error: "You Are Not and Admin"});
    };
};

//check if user is registered 
exports.isRegistered = async (req,res,next) => {
    await User.findById(req.user._id).exec().then(
        next()
    ).catch(err => {
        res.status(403).json({error: "You Are Not Registered"});
    })
};

//authenticated user tokens
exports.authentication = jwts({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
  });
