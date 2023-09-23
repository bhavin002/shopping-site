const seller = require('../../model/seller/seller');
const user = require("../../model/user/user")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail');
const order = require('../../model/order');
const ListIng = require('../../model/seller/listing');
sgMail.setApiKey('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');

const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(422).json({
            status: 422,
            success: false,
            message: "Email is required"
        })
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        res.status(422).json({
            status: 422,
            success: false,
            message: "Enter Valid Email"
        })
    } else {
        try {

            const isExist = await seller.findOne({ email: email });
            if (isExist) {
                res.status(422).json({
                    status: 422,
                    success: false,
                    message: "Email Already Exist"
                })
            } else {
                const otp = Math.floor(100000 + Math.random() * 900000);
                const msg = {
                    to: email,
                    from: `bvasavada8090@gmail.com`,
                    subject: 'OTP Verification',
                    text: `Your OTP: ${otp}`,
                };
                await sgMail.send(msg)
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "OTP Sent Successfully",
                    otp: otp
                })
            }
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error - sendOtp",
                error: error
            })
        }
    }

}

const signUpSeller = async (req, res) => {
    try {
        const { email, otp, storedOtp, pnumber, fullname } = req.body;
        if (!email || !otp || !storedOtp || !pnumber || !fullname) {
            res.status(422).json({
                status: 422,
                suucess: false,
                message: "All Fields Are Required"
            })
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Enter Valid Email"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || pnumber.length !== 10) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Phone Number"
            })
        } else if (otp !== JSON.stringify(storedOtp)) {
            res.status(401).json({
                status: 401,
                suucess: false,
                message: "Incorrect Otp"
            })
        } else {
            const insertOne = await new seller({
                email,
                pnumber,
                fullname
            }).save();
            if (insertOne) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Seller Sign Up Successfully",
                    data: insertOne
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - signUpSeller",
            error: error
        })
    }
}

const createPassword = async (req, res) => {
    try {
        const { password, cpassword } = req.body;
        if (!password || !cpassword) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Required"
            })
        } else if (password !== cpassword) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Password and CPassword Does Not Matched"
            })
        } else {
            const sellerId = req.header('sellerId');
            const isExist = await seller.findOne({ _id: sellerId })
            if (!isExist) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Seller Is Not Found"
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const hashedCPassword = await bcrypt.hash(cpassword, 10);
                const passwordAdded = isExist.passwordObj.push({
                    password: hashedPassword,
                    cpassword: hashedCPassword
                })
                if (passwordAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "password Is Added Successfully"
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - createPassword",
            error: error
        })
    }
}

const createAddress = async (req, res) => {
    try {
        const { pincode, baseaddress, assv, landmark, city, state } = req.body;
        if (!pincode || !baseaddress || !assv || !landmark || !city || !state) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Required"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pincode) || pincode.length !== 6) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Please Enter The Valid Pincode Number"
            })
        } else {
            const sellerId = req.header('sellerId');
            const isExist = await seller.findOne({ _id: sellerId })
            if (!isExist) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Seller Is Not Found"
                })
            } else {
                const addressAdded = isExist.addressObj.push({
                    pincode,
                    baseaddress,
                    assv,
                    landmark,
                    city,
                    state
                })
                if (addressAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "Address Is Added Successfully"
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - createAddress",
            error: error
        })
    }
}

const createBusiness = async (req, res) => {
    try {
        const { gstin } = req.body;
        const { pan } = req.body;

        let savedValue = null;

        if (gstin) {
            savedValue = gstin
        } else if (pan) {
            savedValue = pan
        } else {
            savedValue = null
        }
        const sellerId = req.header('sellerId');
        const isExist = await seller.findOne({ _id: sellerId })
        if (!isExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Seller Is Not Found"
            })
        } else {
            if (savedValue === gstin) {
                const businessAdded = isExist.businessObj.push({
                    gstin: gstin,
                    pan: null
                })
                if (businessAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "GSTIN Is Added Successfully"
                    })
                }
            } else if (savedValue === pan) {
                const businessAdded = isExist.businessObj.push({
                    gstin: null,
                    pan: pan
                })
                if (businessAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "PAN Is Added Successfully"
                    })
                }
            } else {
                const businessAdded = isExist.businessObj.push({
                    gstin: null,
                    pan: null
                })
                if (businessAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "Both GSTIN and PAN Inserted Successfully With Null Value"
                    })
                }
            }
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - createGstin",
            error: error
        })
    }
}

const createBank = async (req, res) => {
    try {
        const { acholder, acnumber } = req.body;
        const sellerId = req.header('sellerId');
        const isExist = await seller.findOne({ _id: sellerId });
        if (!isExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Seller Is Not Found"
            })
        } else if (acholder && acnumber) {
            if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(acnumber) || acnumber.length !== 11) {
                res.status(422).json({
                    status: 422,
                    success: false,
                    message: "Please Enter The Valid acnumber Number"
                })
            } else {
                const bankAdded = isExist.bankObj.push({
                    acholder,
                    acnumber
                })
                if (bankAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "Bank Is Added Successfully"
                    })
                }
            }
        } else {
            const bankAdded = isExist.bankObj.push({
                acholder: null,
                acnumber: null
            })
            if (bankAdded) {
                await isExist.save();
                res.status(201).json({
                    status: 201,
                    success: true,
                    message: "Bank Is Added Successfully"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - createBank",
            error: error
        })
    }
}

const createStore = async (req, res) => {
    try {
        const { dname, sdescription } = req.body;
        const sellerId = req.header('sellerId');
        const isExist = await seller.findOne({ _id: sellerId });
        if (!isExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Seller Is Not Found"
            })
        } else {
            if (!dname || !sdescription) {
                res.status(422).json({
                    status: 422,
                    success: false,
                    message: "All Fileds Are Required"
                })
            } else {
                const storeAdded = isExist.storeObj.push({
                    dname,
                    sdescription
                })
                if (storeAdded) {
                    await isExist.save();
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: "Store Is Added Successfully"
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - createStore",
            error: error
        })
    }

}

const updateBusiness = async (req, res) => {
    try {
        const { gstin } = req.body;
        const sellerId = req.header('sellerId');
        const isExist = await seller.findOne({ _id: sellerId });
        if (!isExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Seller Is Not Found"
            })
        } else {
            if (!gstin) {
                res.status(422).json({
                    status: 422,
                    success: false,
                    message: "All Fileds Are Required"
                })
            } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(gstin) || gstin.length !== 15) {
                res.status(422).json({
                    status: 422,
                    success: false,
                    message: "Enter Valid Gstin"
                })
            } else {
                const UpdateGstin = await seller.findByIdAndUpdate({ _id: sellerId }, {
                    $set: {
                        businessObj: {
                            gstin: gstin,
                            pan: null
                        }
                    }
                }, { new: true })

                if (UpdateGstin) {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Gstin Updated Successfully",
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - updateBusiness",
            error: error
        })
    }
}

const updateBank = async (req, res) => {
    try {
        const { acholder, acnumber } = req.body;
        const sellerId = req.header('sellerId');
        const isExist = await seller.findById(sellerId);
        if (!isExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Seller Is Not Found"
            })
        } else if (!acholder || !acnumber) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fileds Are Required"
            })
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(acnumber) || acnumber.length !== 11) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Enter Valid acnumber"
            })

        } else {
            const UpdateBank = await seller.findByIdAndUpdate({
                _id: sellerId
            }, {
                $set: {
                    bankObj: {
                        acholder,
                        acnumber
                    }
                }
            }, { new: true })

            if (UpdateBank) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Bank Details Updated Successfully",
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - updateBank",
            error: error
        })
    }
}

const getSeller = async (req, res) => {
    try {
        const sellerId = req.header('sellerId');
        if (!sellerId) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Seller Id Not Found"
            })
        } else {
            const sellerOne = await seller.findById(sellerId);
            if (sellerOne) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Seller Details Found",
                    data: sellerOne
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getSeller",
            error: error
        })
    }
}

const singInSeller = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "All Fields Are Required"
            })
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Email Is Invalid"
            })
        } else {
            const isExist = await seller.findOne({ email });
            if (!isExist) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Seller Does Not Found"
                })
            } else {
                const isPasswordMatch = await bcrypt.compare(password, isExist.passwordObj[0].password);
                if (!isPasswordMatch) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        message: "Password Is Invalid"
                    })
                } else {
                    const token = await jwt.sign({ _id: isExist._id }, process.env.JWT_SECRET, {
                        expiresIn: "7d"
                    })
                    res.status(200).json({
                        status: 200,
                        success: true,
                        seller: {
                            _id: isExist._id,
                            fullname: isExist.fullname,
                            email: isExist.email,
                            pnumber: isExist.pnumber,
                            store: isExist.storeObj[0].dname
                        },
                        token
                    })
                }
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - singInSeller",
            error: error
        })
    }
}

const validOneSeller = async (req, res) => {
    try {
        const isValidSeller = await seller.findById({ _id: req.sellerData._id });
        if (!isValidSeller) {
            res.status(403).json({
                status: 403,
                success: false,
                message: "Invalid Selller"
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
            message: "Internal Server Error - validOneSeller",
            error: error
        })
    }
}

const sellerLogOut = async (req, res) => {
    try {
        const logoutSeller = await seller.findById({ _id: req.sellerData._id });
        if (!logoutSeller) {
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
            message: "Internal Server Error - sellerLogOut",
            error: error
        })
    }
}

const getUserOrder = async (req, res) => {
    try {
        const products = await order.aggregate([
            { $unwind: "$products" },
            { $match: { "products.sellerId": new mongoose.Types.ObjectId(req.sellerData._id) } },
            { $addFields: { 'products.ptype': '$ptype', 'products.payment': '$payment', 'products.userid': '$userid' } },
            { $project: { _id: 0, products: 1 } }
        ])
        const users = await user.find({});
        async function getUserName(userid) {
            const oneUser = users.find((user) => user._id.toString() === userid.toString());
            if (oneUser) {
                return oneUser.fullname;
            }
            return "";
        }
        (async () => {
            for (const product of products) {
                const fullname = await getUserName(product.products.userid);
                product.products.fullname = fullname.split(" ")[0];
            }
            if (products) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Successfull!",
                    data: products
                })
            }
        })();

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getUserOrder",
            error: error
        })
    }
}


const getPayments = async (req, res) => {
    try {
        const products = await order.aggregate([
            { $unwind: "$products" },
            { $match: { "products.sellerId": new mongoose.Types.ObjectId(req.sellerData._id) } },
            { $addFields: { 'products.ptype': '$ptype', 'products.payment': '$payment', 'products.userid': '$userid' } },
            {
                $group: {
                    _id: {
                        userid: '$products.userid',
                        payment: '$products.payment'
                    },
                    total: { $sum: '$products.total' }
                }
            },
            {
                $group: {
                    _id: '$_id.userid',
                    pendingTotal: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.payment', 'pending'] }, '$total', 0]
                        }
                    },
                    doneTotal: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.payment', 'done'] }, '$total', 0]
                        }
                    }
                }
            },
            { $project: { _id: 0, userid: '$_id', pendingTotal: 1, doneTotal: 1 } }

        ])
        const users = await user.find({});
        async function getUserName(userid) {
            const oneUser = users.find((user) => user._id.toString() === userid.toString());
            if (oneUser) {
                return oneUser.fullname;
            }
            return "";
        }
        (async () => {
            for (const product of products) {
                const fullname = await getUserName(product.userid);
                product.fullname = fullname.split(" ")[0];
            }
            if (products) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Successfull!",
                    data: products
                })
            }
        })();
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendOtp,
    signUpSeller,
    createPassword,
    createAddress,
    createBusiness,
    createBank,
    createStore,
    updateBusiness,
    updateBank,
    getSeller,
    singInSeller,
    validOneSeller,
    sellerLogOut,
    getUserOrder,
    getPayments
}