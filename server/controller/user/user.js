const user = require("../../model/user/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const order = require("../../model/order");
const ListIng = require("../../model/seller/listing");

const registerUser = async (req, res) => {
    try {
        const { fullname, pnumber, email, password } = req.body;
        const isExist = await user.findOne({ email });
        if (!fullname || !pnumber || !email || !password) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Requird"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || pnumber.length !== 10) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Phone Number"
            })
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Email"
            })
        } else if (isExist) {
            res.status(403).json({
                status: 403,
                success: false,
                message: "User Already Exist"
            })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await new user({
                fullname,
                pnumber,
                email,
                password: hashedPassword
            }).save();
            res.status(201).json({
                status: 201,
                success: true,
                message: "User Successfully Registered",
                newUser
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - registerUser",
            error: error
        })
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Requird"
            })
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Email"
            })
        } else {
            const isExist = await user.findOne({ email });
            if (isExist) {
                const isPasswordMatch = await bcrypt.compare(password, isExist.password);
                if (!isPasswordMatch) {
                    res.status(403).json({
                        status: 403,
                        success: false,
                        message: "Password does not matched"
                    })
                } else {
                    const token = await jwt.sign({ _id: isExist._id }, process.env.JWT_SECRET, {
                        expiresIn: "7d"
                    })
                    res.status(200).json({
                        status: 200,
                        success: true,
                        user: {
                            _id: isExist._id,
                            fullname: isExist.fullname,
                            pnumber: isExist.pnumber,
                            email: isExist.email,
                            password: isExist.password
                        },
                        token
                    })
                }
            } else {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: "User Not Found"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - loginUser",
            error: error
        })
    }
}

const validOneUser = async (req, res) => {
    try {
        const isValid = await user.findById({ _id: req.userData._id });
        if (!isValid) {
            res.status(403).json({
                status: 403,
                success: false,
                message: "Invalid User"
            })
        } else {
            res.status(200).json({
                status: 200,
                ok: true
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - validOneUser",
            error: error
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        const logoutOne = await user.findById({ _id: req.userData._id });
        if (!logoutOne) {
            res.status(403).json({
                status: 403,
                success: false,
                message: "Invalid User Exist"
            })
        } else {
            res.status(200).json({
                status: 200,
                ok: true
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - logoutUser",
            error: error
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { fullname, pnumber, email } = req.body;
        const userOne = await user.findById({ _id: req.userData._id });
        if (!userOne) {
            res.status(403).json({
                status: 403,
                success: false,
                message: "Invalid User Exist"
            })
        } else if (!fullname || !pnumber || !email) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Requird"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || JSON.stringify(pnumber).length !== 10) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Phone Number"
            })
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Email"
            })
        } else {
            const update = await user.findByIdAndUpdate({ _id: req.userData._id }, { fullname, pnumber, email }, { new: true });
            if (update) {
                res.status(202).json({
                    status: 202,
                    success: true,
                    message: "Profile Updated Successfully",
                    update
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - updateProfile",
            error: error
        })
    }
}

const addAddress = async (req, res) => {
    try {
        const { pincode, baseaddress, assv, landmark, city, state } = req.body;
        if (!pincode || !baseaddress || !assv || !landmark || !city || !state) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Requird"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pincode) || pincode.length !== 6) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Pincode Number"
            })
        } else {
            const userId = await req.userData._id;
            const isUser = await user.findById(userId);
            let isDefault = false;
            if (isUser.addressObj.length === 0) {
                isDefault = true;
            }
            const addressAdded = isUser.addressObj.push({
                pincode,
                baseaddress,
                assv,
                landmark,
                city,
                state,
                isDefault: isDefault
            })
            if (addressAdded) {
                await isUser.save();
                res.status(201).json({
                    status: 201,
                    success: true,
                    message: "Address Is Added Successfully"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - addAddress",
            error: error
        })
    }
}

const getAddress = async (req, res) => {
    try {
        const isUser = await user.findById(req.userData._id);
        if (isUser) {
            const address = isUser.addressObj;
            if (address) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Address Fetched Successfully",
                    data: address
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getAddress",
            error: error
        })
    }
}

const getDefaultAddress = async (req, res) => {
    try {
        const isUser = await user.findById(req.userData._id);
        if (isUser) {
            const address = isUser.addressObj.filter(address => address.isDefault === true);
            if (address) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "default address fetched successfully",
                    data: address
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getDefaultAddressx",
            error: error
        })
    }
}

const deleteAddress = async (req, res) => {
    try {
        const isUser = await user.findById(req.userData._id);
        if (isUser) {
            const addressId = req.params['id'];
            const addresses = isUser.addressObj.filter((values) => {
                return values._id != addressId
            })
            isUser.addressObj = addresses;
            await isUser.save();
            res.status(200).json({
                status: 200,
                success: true,
                message: "Address Deleted Successfully"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - deleteAddress",
            error: error
        })
    }
}

const getAddressById = async (req, res) => {
    try {
        const isUser = await user.findById(req.userData._id);
        if (isUser) {
            const addressId = req.params['id'];
            const address = isUser.addressObj.filter((values) => {
                return values._id == addressId
            })
            if (address) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Address Fetched Successfully",
                    data: address
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getAddressById",
            error: error
        })

    }
}

const updateAddress = async (req, res) => {
    try {
        const { pincode, baseaddress, assv, landmark, city, state } = req.body;
        if (!pincode || !baseaddress || !assv || !landmark || !city || !state) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Requird"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pincode) || JSON.stringify(pincode).length !== 6) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Pincode Number"
            })
        } else {
            const isUser = await user.findById(req.userData._id);
            if (isUser) {
                const addressId = req.params['id'];
                const isAddress = await isUser.addressObj.id(addressId);
                if (isAddress) {
                    isAddress.pincode = pincode;
                    isAddress.baseaddress = baseaddress;
                    isAddress.assv = assv;
                    isAddress.landmark = landmark;
                    isAddress.city = city;
                    isAddress.state = state;
                    await isUser.save();
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Address Updated Successfully"
                    })
                }
            }


        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - updateAddress",
            error: error
        })
    }
}

const defaultAddress = async (req, res) => {
    try {
        const isUser = await user.findById(req.userData._id);
        if (isUser) {
            const addressId = req.params['id'];
            const address = isUser.addressObj;
            const updateAddresses = address.map((address) => {
                if (address) {
                    return {
                        ...address,
                        isDefault: false
                    }
                }
                return address
            })

            isUser.addressObj = updateAddresses;
            await isUser.save();
            const isAddress = await isUser.addressObj.id(addressId);
            if (isAddress) {
                isAddress.isDefault = true;
                await isUser.save();
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Address Updated Successfully"
                })
            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - defaultAddress",
            error: error
        })
    }
}

const getDetails = async (req, res) => {
    try {
        const userId = req.params['id'];
        const isUser = await user.findById(userId);
        if (isUser) {
            res.status(200).json({
                status: 200,
                success: false,
                message: "userDetails fetched successfully",
                data: isUser
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getDetails",
            error: error
        })
    }
}

const placedOrder = async (req, res) => {
    try {
        const { userid, ptype, payment, products, totalAmount } = req.body;
        const parseProducts = JSON.parse(products);
        const orderPlaced = await new order({
            userid: userid,
            ptype: ptype,
            payment: payment,
            products: parseProducts,
            totalAmount: totalAmount
        }).save();
        if (orderPlaced) {
            parseProducts.forEach(async (product) => {
                const { _id, quantity } = product;
                await ListIng.findOneAndUpdate(
                    { _id },
                    { $set: { 'listingInfoObj.inventory.sellItem': +quantity } },
                    { new: true }
                );
            })
            res.status(201).json({
                status: 201,
                success: true,
                message: "Order placed successfully"
            })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - placedOrder",
            error: error
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const isUser = await order.find({ userid: req.userData._id });
        if (isUser) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "orders fetched Successfully",
                data: isUser
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const orderDetails = async (req, res) => {
    try {
        const isUser = await order.find({ userid: req.userData._id });
        if (isUser) {
            const oid = req.params['oid'];
            const orderDetails = isUser.filter(order => order._id == oid);
            if (orderDetails) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "orderdetails fetched successfully",
                    data: orderDetails
                })
            }
        }

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    registerUser,
    loginUser,
    validOneUser,
    logoutUser,
    updateProfile,
    addAddress,
    getAddress,
    getDefaultAddress,
    deleteAddress,
    getAddressById,
    updateAddress,
    defaultAddress,
    getDetails,
    placedOrder,
    getAllOrders,
    orderDetails
}