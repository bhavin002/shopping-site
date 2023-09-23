const mongoose = require("mongoose");
const userAddressSchmeas = require("./Obj/address");
const userSchemas = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    pnumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    addressObj:[userAddressSchmeas]
}, { timestamps: true })

const user = mongoose.model("userschemas", userSchemas);
module.exports = user;