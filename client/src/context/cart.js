import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const cartcontext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const amounts = cartItems.map(item => item.total);
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    const qty = cartItems.map(item => item.quantity);
    const totalQty = qty.reduce((sum, qty) => sum + qty, 0);
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));

    const getCart = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem("userAuth")).user._id
            const res = await axios.post(`http://localhost:8081/api/user/cart/getcartbyuser`, {
                userId
            });
            if (res.data.status === 200) {
                setCartItems(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (userAuth?.token) {
            getCart();
        } else {
            setCartItems([])
        }
        // eslint-disable-next-line
    }, [userAuth?.token])

    const qtyPlus = async (pid) => {
        const userId = JSON.parse(localStorage.getItem("userAuth")).user._id
        const res = await axios.post(`http://localhost:8081/api/user/cart/qtyplus`, { userId, pid })
        if (res.data.status === 200) {
            getCart(userId);
        }

    }
    const qtyMinus = async (pid) => {
        const userId = JSON.parse(localStorage.getItem("userAuth")).user._id
        const res = await axios.post(`http://localhost:8081/api/user/cart/qtyminus`, { userId, pid })
        if (res.data.status === 200) {
            getCart(userId);
        }
    }

    const removeAllCart = async () => {
        const userId = JSON.parse(localStorage.getItem("userAuth")).user._id
        const res = await axios.post(`http://localhost:8081/api/user/cart/removeallcart`, {
            userId
        })

        if (res.data.status === 200) {
            getCart(userId);
        }
    }

    const addToCart = async (_id, sellerId, pname, pprice, pcolor, pdescription, pimage) => {
        try {
            const userId = JSON.parse(localStorage.getItem("userAuth")).user._id
            const res = await axios.post(`http://localhost:8081/api/user/cart/addtocart`, { userId, _id, sellerId, pname, pprice, pcolor, pdescription, pimage })
            if (res.data.success === true) {
                getCart(userId)
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <cartcontext.Provider value={{ addToCart, cartItems, setCartItems, qtyPlus, qtyMinus, getCart, removeAllCart, totalAmount, totalQty }}>
            {children}
        </cartcontext.Provider>
    )

}

export const useCart = () => {
    return useContext(cartcontext);
}
