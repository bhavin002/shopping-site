import React from 'react'
import "../../style/Header.css";
import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/user';
import logo from "../../images/logo.png"
import { useSeller } from '../../context/seller';
import Cart from '../../pages/Cart';

const Navbar = () => {
    const { user } = useUser();
    const { seller } = useSeller();
   
    return (
        <div className="header">
            <div className="container">
                <div className="row py-3">
                    <div className="col-md-2 pt-1">
                        <img src={logo} alt="logo" className='img img-fluid' />
                    </div>
                    <div className="col-md-5">
                        <div className="search">
                            <i className="fa fa-search"></i>
                            <input type="text" className="form-control" placeholder="Search for product,brands and more" />
                            <button className="btnSearch">Search</button>
                        </div>
                    </div>
                    <div className="col-md-5 d-flex justify-content-around align-items-center">
                        <NavLink className="headerLink" to="/">Home</NavLink>
                        {
                            seller.token ? <NavLink className="headerLink" to="sellerdash/seller">{seller.seller.store}</NavLink> :
                                <NavLink className="headerLink" to="becomeseller">Become a Seller</NavLink>
                        }
                        {
                            user.token ? <NavLink className="headerLink" to="dashboard/user">{user.user.fullname.split(" ")[0]}</NavLink>
                                : <NavLink className="headerLink" to="login">Login</NavLink>
                        }
                        <Cart/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;