const cart = require("../../../model/user/cart");

const addTocart = async (req, res) => {
    try {
        const { userId, _id, sellerId, pname, pprice, pcolor, pdescription, pimage } = req.body;
        const isuserExist = await cart.findOne({ userId: userId });
        if (!isuserExist) {
            const cartWithNewUser = await new cart({
                userId: userId,
                cart: {
                    _id,
                    sellerId,
                    pname,
                    pprice,
                    pcolor,
                    pdescription,
                    pimage,
                    quantity: 1,
                    total: pprice * 1
                }
            }).save()

            if (cartWithNewUser) {
                res.status(201).json({
                    status: 201,
                    success: true,
                    message: "cart create with new user"
                })
            }

        } else {
            const isProductExist = isuserExist.cart.id(_id)
            let updateCart;
            if (isProductExist) {
                isProductExist.quantity = isProductExist.quantity + 1
                isProductExist.total = isProductExist.pprice * isProductExist.quantity
                updateCart = await isuserExist.save();
            } else {
                isuserExist.cart.push({
                    _id,
                    sellerId,
                    pname,
                    pprice,
                    pcolor,
                    pdescription,
                    pimage,
                    quantity: 1,
                    total: pprice * 1
                })
                updateCart = await isuserExist.save();
            }
            if (updateCart) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "cart update successfully"
                })
            }

        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - addTocart",
            error: error
        })
    }
}

const getCartByUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const isUser = await cart.findOne({ userId: userId });
        if (isUser) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "cart item get successfully",
                data: isUser.cart
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getCartByUser",
            error: error
        })
    }
}

const qtyPlus = async (req, res) => {
    try {
        const { userId, pid } = req.body;
        const isUser = await cart.findOne({ userId: userId })
        if (isUser) {
            let isProduct = isUser.cart.id(pid);
            if (isProduct) {
                isProduct.quantity = isProduct.quantity + 1;
                isProduct.total = isProduct.pprice * isProduct.quantity
                await isUser.save();
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "cart item quantity Plus successfully",
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - qtyPlus",
            error: error
        })
    }
}

const qtyMinus = async (req, res) => {
    try {
        const { userId, pid } = req.body;
        const isUser = await cart.findOne({ userId: userId })
        let updateCart;
        if (isUser) {
            let isProduct = isUser.cart.id(pid);
            if (isProduct.quantity === 1) {
                isUser.cart = isUser.cart.filter((values) => {
                    return values._id != pid
                })
                updateCart = await isUser.save();
            } else {
                isProduct.quantity = isProduct.quantity - 1;
                isProduct.total = isProduct.pprice * isProduct.quantity
                updateCart = await isUser.save();
            }

            if (updateCart) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "cart item quantity Minus successfully",
                })
            }
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - qtyMinus",
            error: error
        })
    }
}

const getSubTotal = async (req, res) => {
    try {
        const { userId } = req.body;
        const isUser = await cart.findOne({ userId: userId });
        if (isUser) {
            console.log(isUser);
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getSubTotal",
            error: error
        })
    }
}

const removeAllCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const isUser = await cart.findOne({ userId: userId });
        if (isUser) {
            isUser.cart = [];
            await isUser.save();
            res.status(200).json({
                status: 200,
                success: true,
                message: "remove all cart by user"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addTocart,
    getCartByUser,
    qtyPlus,
    qtyMinus,
    getSubTotal,
    removeAllCart
}