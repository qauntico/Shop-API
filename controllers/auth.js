const User = require('../models/user');
const bcrypt = require('bcrypt');
const {  validationResult } = require('express-validator');//handle field validation for complete data entry
const jwt = require('jsonwebtoken');
const {expressjwt: jwts }  = require('express-jwt');
const {errorHandler,customValidatorError } = require('../Helpers/errorhandler');//error handler methods
const Token = require('../models/token');
const sendMail = require('../utils/sendEmail');
const crypto = require('crypto');

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
            const email = req.body.email
            const newUser = new User({...req.body,email: email.toLowerCase(),["password"]: hash});
            await newUser.save().then(async (user)=> {
                const token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                })
                await token.save()
                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
                await sendMail(user.email,'Verify Email',url );
                res.json({success: 'Account not verified an email has been sent to your account for verification, it will expire after 2 hours'});
                console.log('yes')
                const delayInMilliseconds = 2 * 60 * 60 * 1000;
                setTimeout(async () => {
                    await Token.findOneAndDelete({token: token.token});
                },delayInMilliseconds)
            }).catch(err => {
                console.log(err)//checking saving error from the developer site
                return res.status(400).json({error: "Either The Email You Trying To Save Already Exist Or You Have Entered a Wrong Value SomeWhere"});
            });
        };    
    });
};

exports.verify = async (req,res) => {
    try {
        const user = await User.findOne({_id: req.user._id}).exec(); 
        if(!user) return res.status(400).json({error: "invalid user"})

        const token = await Token.findOne({
            userId: user._id
        })
        if (!token) return res.status(400).json({error: 'invalid link'});
        console.log(token)
        //await User.updateOne({_id: user._id,verified: true});
        await User.findByIdAndUpdate(user._id , { $set: {verified: true}}).then(async (result) => {
            //await token.remove();
            await Token.findOneAndDelete({token: token.token}).then(res.status(200).send({success: 'Email verified successfully'}))
            }
         )
    } catch (error) {
        
    }
}

//signin a user 
exports.signin = async (req, res) => {
    const username = req.body.email.toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({ email: username }).exec(); //check if user exists
    if (user) {
        bcrypt.compare(password, user.password,async function (err, result) {
            if (!err) {
                if (result) {
                    if (!user.verified) {
                        const token = await Token.findOne({userId: user._id});
                        if(!token){
                            const token = await new Token({
                                userId: user._id,
                                token: crypto.randomBytes(32).toString('hex')
                            })
                            await token.save()
                            const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
                            await sendMail(user.email,'Verify Email',url );
                            res.json({error: 'An email sent To your account please verify'});
                        }
                        return res.status(400).send({error: 'An email was sent to this account for verification'})
                    }
                    const token = jwt.sign({ _id: user._id,  role: user.role}, process.env.JWT_SECRET); // Token expires at the end of the session
                    res.cookie('myCookie', token, {
                        httpOnly: true,
                        secure: false, // Set this to true when using HTTPS
                        sameSite: 'strict',
                        expires: 0,
                    });
                    user.password = undefined;
                    return res.json({ token: token, user: user });
                } else {
                    res.status(403).json({ error: 'Incorrect password' });
                }
            } else {
                res.status(403).json({ error: errorHandler(err) });
            }
        });
    } else {
        res.status(400).json({ error: 'User was not found' });
    }
};
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

//adding the token to the request
exports.token = async (req,res,next, id) => {
    const token = await Token.findOne({token: id}).exec();
    if(token){
        req.token = token
        next()
    }else{
        res.status(403).json({error: "There's no token"})
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
//exports.authentication = jwts({
    //secret: process.env.JWT_SECRET,
    //algorithms: ['HS256']
  //});

exports.authentication = (req, res, next) => {
    const token = req.cookies.myCookie; // Fetch the token from the cookie
   
    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        next();
    });
};


