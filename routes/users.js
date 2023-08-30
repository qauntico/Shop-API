const express = require('express');
const {authentication, userId,isAdmin,isRegistered,token,verify} = require('../controllers/auth')
const {read,list, update, remove, purchaseHistory} = require('../controllers/users')
const router = express.Router();


router.get('/protected',authentication,(req,res) => {
    res.send('Welcome to my api')
});
router.get('/user/:userId',isRegistered,authentication, read);
router.get('/all/users/:userId',isRegistered,isAdmin,authentication, list);
router.get('/orders/by/user/:userId', isRegistered, authentication, purchaseHistory);
router.put('/user/:userId',isRegistered,authentication, update);
router.delete('/user/:userId', isRegistered,authentication, remove);
router.get('/:userId/verify/:token',verify)

router.param('userId',userId);
router.param('token',token);
module.exports = router;