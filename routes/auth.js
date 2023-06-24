const express = require('express');
const router = express.Router();
const {signup, signin} = require('../controllers/auth')
const validation = require('../authentication/validation')
router.post('/signup',validation,signup);
router.post('/signin', signin)

module.exports = router;