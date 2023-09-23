const express = require("express");
const { addTocart, getCartByUser, qtyPlus, qtyMinus, getSubTotal, removeAllCart } = require("../../../controller/user/cart/cart");
const routes = express.Router();

routes.post(`/addtocart`, addTocart);
routes.post("/getcartbyuser", getCartByUser);
routes.post("/qtyplus", qtyPlus);
routes.post("/qtyminus", qtyMinus);
routes.get("/getsubtotal", getSubTotal);
routes.post("/removeallcart", removeAllCart);

module.exports = routes;