const mongoose = require("mongoose");
const sellerAddressSchemas = require("./Obj/address");
const passwordSchemas = require("./Obj/password");
const businessSchemas = require("./Obj/business");
const bankSchemas = require("./Obj/bank");
const storeSchemas = require("./Obj/store");
const sellerSchemas = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pnumber: {
        type: Number,
        required: true,
    },
    fullname: {
        type: String,
        required: true
    },
    passwordObj: [passwordSchemas],
    addressObj: [sellerAddressSchemas],
    businessObj: [businessSchemas],
    bankObj: [bankSchemas],
    storeObj:[storeSchemas]
}, { timestamps: true });

const seller = mongoose.model("sellerschemas", sellerSchemas);
module.exports = seller;