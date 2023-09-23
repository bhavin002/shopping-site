import { createContext, useContext, useEffect, useState } from "react";

export const usercontext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        user: {},
        token: ""
    });

    const login = (info, token) => {
        setUser({
            ...user,
            user:info,
            token:token
        })
    }

    useEffect(() => {
        const userItem = localStorage.getItem("userAuth");
        if (userItem) {
            const parseData = JSON.parse(userItem);
            login(parseData.user, parseData.token);
        }
        // eslint-disable-next-line
    }, [])

    return (
        <usercontext.Provider value={{ user, login }}>
            {children}
        </usercontext.Provider>
    )

}

export const useUser = () => {
    return useContext(usercontext);
}
