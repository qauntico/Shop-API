const express = require('express');
const router = express.Router();
const {userId, isAdmin, authentication, isRegistered} = require('../controllers/auth');
const {create,list,userRequestId,deleteUser,remove, update} = require('../controllers/adminRequest');

router.post('/admin/request/:userId',isRegistered,authentication, create);
router.get('/adminrequest/:userId',isRegistered,isAdmin,authentication, list);
router.put('/update/request/:userRequestId/:userId',isRegistered,isAdmin,authentication,deleteUser, update);
router.delete('/delete/request/:userId',isRegistered,authentication, remove);

router.param('userId', userId);
router.param('userRequestId', userRequestId);

module.exports = router;