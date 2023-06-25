const express = require('express');
const {userId,isAdmin,isRegistered,authentication} = require('../controllers/auth');
const {create,list,update,singleProduct,photo,productId} = require('../controllers/product');

const router = express.Router();
router.post('/product/:userId',isRegistered,isAdmin,authentication, create)
router.get('/products',list);
router.get('/product/one/:productId', singleProduct);
router.put('/product/:productId/:userId',isRegistered,isAdmin,authentication, update);
router.get('/product/photo/:productId',photo)
router.param('userId', userId);
router.param('productId', productId)

module.exports = router;