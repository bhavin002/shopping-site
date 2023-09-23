import { createContext, useState, useContext, useEffect } from "react";

const sellercontext = createContext(null);

export const SellerProvider = ({ children }) => {

    const [seller, setSeller] = useState({
        seller: {},
        token: ""
    })

    const signIn = (info, token) => {
        setSeller({
            ...seller,
            seller: info,
            token: token
        })
    }

    useEffect(() => {
        const sellerItem = localStorage.getItem("sellerAuth");
        if (sellerItem) {
            const sellerParse = JSON.parse(sellerItem);
            signIn(sellerParse.seller, sellerParse.token);
        }
        // eslint-disable-next-line
    }, [])

    return (
        <sellercontext.Provider value={{ seller, signIn }}>
            {children}
        </sellercontext.Provider>
    )
}

export const useSeller = () => {
    return useContext(sellercontext);
}
