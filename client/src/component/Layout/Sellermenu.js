import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useSeller } from '../../context/seller';
import axios from "axios"

const Sellermenu = () => {
    const { seller,signIn } = useSeller();
    const navigate = useNavigate();
    const logOutSeller = async (e) => {
        e.preventDefault();
        const res = await axios.get("http://localhost:8081/api/seller/logoutseller", {
            headers: {
                "Authorization": seller.token
            }
        })

        if(res.data.ok){
            signIn({},"");
            localStorage.removeItem('sellerAuth');
            navigate("/becomeseller");
        }
    }
    return (
        <div>
            <div className="heading">
                <p>{seller?.seller.store}</p>
            </div>
            <div className="menu-item">
                <ul>
                    <li><NavLink to="/sellerdash/seller/newlisting" className="userLink">Add New Listing</NavLink></li>
                    <li><NavLink to="/sellerdash/seller/listings" className="userLink">Your Listed Products</NavLink></li>
                    <li><NavLink to="/sellerdash/seller/orders" className="userLink">Manage Your Orders</NavLink></li>
                    <li><NavLink to="/sellerdash/seller/payments" className="userLink">Manage Your Payments</NavLink></li>
                    <button className="btn btn-danger w-100 mt-3" onClick={logOutSeller}>Logout</button>
                </ul>
            </div>
        </div>
    )
}

export default Sellermenu;