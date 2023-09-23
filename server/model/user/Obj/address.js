const userAddressSchmeas = {
    pincode: {
        type: Number,
        required: true
    },
    baseaddress: {
        type: String,
        required: true
    },
    assv: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}

module.exports = userAddressSchmeas;
