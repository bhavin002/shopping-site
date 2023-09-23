const mongoose = require("mongoose")
const productSchemas = require("./user/Obj/product")
const orderSchemas = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userschemas"
    },
    ptype: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    products: [
        productSchemas
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const order = mongoose.model("orderschemas", orderSchemas);
module.exports = order;