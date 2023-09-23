const express = require("express");
const { sendOtp, signUpSeller, createPassword, createAddress, createBusiness, createBank, createStore, updateBusiness, updateBank, getSeller, singInSeller, validOneSeller, sellerLogOut, getUserOrder, getPayments } = require("../../controller/seller/seller");
const { requireSignIn } = require("../../middleware/sellerAuth");
const routes = express.Router();

routes.post("/sendotp", sendOtp);
routes.post("/signupseller", signUpSeller);
routes.post("/password", createPassword);
routes.post("/address", createAddress);
routes.post("/business", createBusiness);
routes.post("/bank", createBank);
routes.post("/store", createStore);
routes.post("/updatebusiness", updateBusiness);
routes.post("/updatebank", updateBank);
routes.get("/getseller", getSeller);
routes.post("/signinseller", singInSeller);
routes.get("/validoneseller", requireSignIn, validOneSeller);
routes.get("/logoutseller", requireSignIn, sellerLogOut);
// routes.get("/listingmodifybystock", requireSignIn, listingModifyByStock);
routes.get("/getuserorders", requireSignIn, getUserOrder);
routes.get("/getpayments", requireSignIn, getPayments);


module.exports = routes;