const express = require('express');
const router = express.Router();
const {signup, signin, logout} = require('../controllers/auth')
const validation = require('../authentication/validation')
router.post('/signup',validation,signup);
router.post('/signin', signin);
router.post('/logout', logout);

module.exports = router;