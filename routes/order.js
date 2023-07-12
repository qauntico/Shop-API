const express = require('express');
const router = express.Router();
const {userId,isAdmin,isRegistered,authentication} = require('../controllers/auth');
const {create,listOrders,getStatusValues,updateOrderStatus,orderId} = require("../controllers/order");
const {addOrderToUserHistory} =require('../controllers/users');
const { decreaseQuantity } = require("../controllers/product");

router.post("/order/create/:userId",isRegistered,authentication,addOrderToUserHistory,decreaseQuantity,create);
router.get("/order/list/:userId", isRegistered,isAdmin, authentication, listOrders);
router.get("/order/status-value/:userId", isRegistered,isAdmin, authentication, getStatusValues);
router.put("/order/:orderId/status/:userId", isRegistered,isAdmin, authentication, updateOrderStatus);

router.param('userId',userId);
router.param('orderId',orderId)
module.exports = router;
