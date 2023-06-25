const express = require('express');
const {authentication} = require('../controllers/auth')
const router = express.Router();


router.get('/protected',authentication,(req,res) => {
    res.send('you won')
});

module.exports = router;