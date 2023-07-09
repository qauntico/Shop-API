const express = require('express');
const router = express.Router();
const {authentication, userId,isRegistered} = require('../controllers/auth')
const {generateToken,processPayment } = require("../controllers/braintree")

router.get('/braintree/getToken/:userId',isRegistered,authentication, generateToken  );
router.post("/braintree/payment/:userId",isRegistered,authentication,processPayment);


router.param('userId',userId);
module.exports = router;