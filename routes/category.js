const express = require('express');
const router = express.Router();
const {create, list, category, categoryId, update, remove} = require('../controllers/category');
const {userId, isAdmin, authentication, isRegistered} = require('../controllers/auth')

router.post('/category/create/:userId',isRegistered,isAdmin, authentication, create);
router.get('/all/category', list);
router.get('/category/:categoryId', category);
router.put('/category/:categoryId/:userId',isRegistered,isAdmin,authentication, update);
router.delete('/category/:categoryId/:userId',isRegistered,isAdmin, authentication, remove);

router.param('userId', userId)
router.param('categoryId', categoryId);

module.exports = router;