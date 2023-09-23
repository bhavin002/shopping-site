const mongoose = require("mongoose");
const productSchemas = require("./Obj/product");
const cartSchemas = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userschemas"
    },
    cart: [productSchemas]
})

const cart = mongoose.model("cartschemas", cartSchemas);
module.exports = cart;