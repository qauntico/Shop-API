require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//routes imports
const auth = require('./routes/auth');
const category = require('./routes/category');
const product = require('./routes/product');
const user = require('./routes/users');
const braintree = require('./routes/braintree');
const order = require('./routes/order');
const adminRequest = require('./routes/adminRequest');
const morgan = require('morgan');
const cors = require('cors');


const app = express();
async function main(){
    await mongoose.connect(process.env.DATABASE,{ useNewUrlParser:true});

    app.use(bodyParser.json());//parse json data 
    app.use(morgan('dev'));//will help show the various statuses when a request is sent to any of api routes
    app.use(cookieParser());//will be use to parse cookies and will be mostly used by express-jwt
    app.use(cors());//will help our api handle request headers correctly

    //routes
    app.use('/api', auth);
    app.use('/api', category);
    app.use('/api', product);
    app.use('/api',user);
    app.use('/api',braintree);
    app.use('/api',order);
    app.use('/api', adminRequest);
    


}
main().catch(console.dir);//catches any error and prints to the console

app.listen(process.env.PORT, function() {
    console.log('server started '+process.env.PORT)
});