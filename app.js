require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//routes imports
const auth = require('./routes/auth');
const product = require('./routes/category');
const user = require('./routes/users');
const category = require('./routes/category');
const morgan = require('morgan');


const app = express();
async function main(){
    await mongoose.connect(process.env.DATABASE,{ useNewUrlParser:true});

    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cookieParser());

    //routes
    app.use('/api', auth);
    app.use('/api', product);
    app.use('/api',user);
    app.use('/api', category);


}
main().catch(console.dir);

app.listen(process.env.PORT, function() {
    console.log('server started '+process.env.PORT)
});