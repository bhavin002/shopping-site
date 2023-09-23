const mongoose = require("mongoose");

const productSchemas = {
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "listingschema"
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellerschemas"
    },
    pname: {
        type: String,
        required: true
    },
    pprice: {
        type: Number,
        required: true
    },
    pcolor: {
        type: String,
        required: true
    },
    pdescription: {
        type: String,
        required: true
    },
    pimage: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
}

module.exports = productSchemas;