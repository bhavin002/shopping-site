import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import "../../style/User.css";
import { useUser } from '../../context/user';
import axios from "axios"
import { useCart } from '../../context/cart';
import "../../style/Account.css";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import LogoutIcon from '@mui/icons-material/Logout';

const Usermenu = () => {
    const { user, login } = useUser();
    const navigate = useNavigate();
    const { setCartItems } = useCart();
    const [address, setAddress] = useState({
        baseaddress: '',
        assv: '',
        pincode: '',
        landmark: '',
        city: '',
        state: ''
    })
    const [isAddress, setIsAddress] = useState(false);
    const { baseaddress, assv, pincode, landmark, city, state } = address;
    const logOut = async () => {
        const res = await axios.get(`http://localhost:8081/api/user/logoutuser`, {
            headers: {
                "Authorization": user.token
            }
        })
        if (res.data.ok) {
            setCartItems([]);
            login({}, "");
            localStorage.removeItem("userAuth");
            navigate("/login");
        }
    }

    const getDefaultAddress = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/user/getdefaultaddress`, {
                headers: {
                    "Authorization": user.token
                }
            })
            if (res.data.status === 200) {
                if (res.data.data.length > 0) {
                    const { baseaddress, assv, landmark, pincode, city, state } = res.data.data[0]
                    setAddress({
                        ...address,
                        baseaddress: baseaddress,
                        assv: assv,
                        landmark: landmark,
                        pincode: pincode,
                        city: city,
                        state: state
                    })
                    setIsAddress(true);
                } else {
                    setIsAddress(false);

                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDefaultAddress();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="account_section">
            <div className="container">
                <div className="row mt-4">
                    <div className="col-1">
                        <KeyboardBackspaceIcon style={{ fontSize: "40px", cursor: "pointer" }} />
                    </div>
                    <div className="col-11 px-5">
                        <p className='acTitle'>My Account</p>
                    </div>
                </div>
                <div className="userCards mt-4">
                    <div className="row m-3 py-3" style={{ borderBottom: "2px dashed gray" }}>
                        <div className="col-3 d-flex justify-content-center align-items-center text-center">
                            <div className='nicename pt-2'>bV</div>
                        </div>
                        <div className="col-9">
                            <p className="lead">{user?.user.fullname}</p>
                            <p className="title">{user?.user.email}m</p>
                            <p className="title">+91{user?.user.pnumber}</p>
                        </div>
                    </div>
                    <div className="row m-3 py-3">
                        <div className="col-3 d-flex justify-content-center align-items-center text-center">
                            <div className='homeLogo'>Home</div>
                        </div>
                        <div className="col-9">
                            {
                                isAddress ? <p className='address'>{`${baseaddress}, ${landmark}, ${assv}, ${city}, ${state} - ${pincode}`}</p> : <p className='title'>, , , , , ,</p>
                            }
                        </div>
                    </div>
                </div>
                <div className="userCards mt-3">
                    <div className="row my-4">
                        <div className="col-6 text-center" style={{ borderRight: "2px solid gray" }}>
                            <div>
                                <PinDropIcon style={{ fontSize: "50px" }} />
                                <NavLink to="/dashboard/user/address" style={{ "textDecoration": "none" }}><p className='address mt-3' style={{ cursor: "pointer" }}>Manage Address</p></NavLink>
                            </div>
                        </div>
                        <div className="col-6 text-center">
                            <div>
                                <AllInboxIcon style={{ fontSize: "50px" }} />
                                <NavLink to="/dashboard/user/order" style={{ "textDecoration": "none" }}><p className='address mt-3' style={{ cursor: "pointer" }}>My Orders</p></NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userCards mt-3">
                    <div className="row m-2">
                        <div className="col-12">
                            <LogoutIcon style={{ fontSize: "30px", color: "red" }} />
                            <span className='logout mx-3' onClick={logOut}>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div>
        //     <div className="heading">
        //         <p>Dashboard</p>
        //     </div>
        //     <div className="menu-item">
        //         <ul>
        //             <li><NavLink to="/dashboard/user/order" className="userLink">Manage Your Order</NavLink></li>
        //             <li><NavLink to="/dashboard/user/profile" className="userLink">Manage Your Profile</NavLink></li>
        //             <li><NavLink to="/dashboard/user/address" className="userLink">Manage Your Address</NavLink></li>
        //             <button className="btn btn-danger w-100 mt-3" onClick={logOut}>Logout</button>
        //         </ul>
        //     </div>
        // </div>
    )
}

export default Usermenu;