const listingInfoSchemas = {
    listing: {
        lstatus: {
            type: String,
            required: true
        }
    },
    inventory: {
        stock: {
            type: Number,
            required: true
        },
        sellItem: {
            type: Number,
            default: 0
        }
    },
    
    delivery: {
        dcharge: {
            type: Number,
            required: true
        }
    },
    product: {
        pname: {
            type: String,
            required: true
        },
        pprice: {
            type: Number,
            required: true
        },
        pcategory: {
            type: String,
            ref: "orderschemas"
        },
        pbrand: {
            type: String,
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
            default: null
        }
    }
}

module.exports = listingInfoSchemas;