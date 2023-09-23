const express = require("express");
const { requireLogin } = require("../../middleware/userAuth");
const { registerUser, loginUser, validOneUser, logoutUser, updateProfile, addAddress, getAddress, getDefaultAddress, deleteAddress, getAddressById, updateAddress, defaultAddress, getDetails, placedOrder, getAllOrders, orderDetails } = require("../../controller/user/user");
const routes = express.Router();

routes.post("/registeruser", registerUser);
routes.post("/loginuser", loginUser);
routes.get("/validoneuser", requireLogin, validOneUser);
routes.get("/logoutuser", requireLogin, logoutUser);
routes.post("/updateuserproflie", requireLogin, updateProfile);
routes.post("/addaddress", requireLogin, addAddress);
routes.get("/getaddress", requireLogin, getAddress);
routes.get("/getdefaultaddress", requireLogin, getDefaultAddress)
routes.get("/deleteaddress/:id", requireLogin, deleteAddress);
routes.get("/getaddressbyid/:id", requireLogin, getAddressById);
routes.post("/updateaddress/:id", requireLogin, updateAddress);
routes.get("/setdefaultaddress/:id", requireLogin, defaultAddress);
routes.get("/getuserdetails/:id", getDetails);
routes.post("/placedorder", placedOrder);
routes.get("/getallorders", requireLogin, getAllOrders)
routes.get("/orderdetails/:oid", requireLogin, orderDetails)

module.exports = routes;