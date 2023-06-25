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
const morgan = require('morgan');
const cors = require('cors')


const app = express();
async function main(){
    await mongoose.connect(process.env.DATABASE,{ useNewUrlParser:true});

    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(cors());

    //routes
    app.use('/api', auth);
    app.use('/api', category);
    app.use('/api', product);
    app.use('/api',user);
    


}
main().catch(console.dir);

app.listen(process.env.PORT, function() {
    console.log('server started '+process.env.PORT)
});