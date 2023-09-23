const mongoose = require("mongoose");
const listingInfoSchemas = require("./Obj/listingInfo");
const listingSchemas = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellerschemas"
    },
    listingInfoObj: listingInfoSchemas
}, { timestamps: true })

const ListIng = mongoose.model("listingschema", listingSchemas);
module.exports = ListIng;