import React, { useState } from 'react'
import ButtonGroup from '@mui/material/ButtonGroup';
import { Add, Remove } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/material/Menu';
import "../style/Cart.css"
import { useNavigate } from 'react-router-dom';
import Empty from "../images/cart.gif"
import { useCart } from '../context/cart';
import Close from "../images/close.png"
import { useUser } from '../context/user';

const Cart = () => {
    const { cartItems, qtyPlus, qtyMinus, totalAmount, totalQty } = useCart();
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useUser();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const singleProduct = async (id) => {
        handleClose();
        navigate(`/product/${id}`);
    }

    const COrder = (userId) => {
        handleClose();
        navigate(`/checkout/${userId}`)
    }

    return (
        cartItems.length > 0 ? <>
            <Badge badgeContent={totalQty} color="primary">
                <ShoppingCartIcon id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className="text-light" />
            </Badge>
            <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                <div className="containerCart">
                    <div className="fixed-top border-bottom border-2 border-dark">
                        <p>Your Cart : {totalQty} Items</p>
                    </div>
                    <div className="scrollable-content">
                        {
                            cartItems.map((values) => {
                                return (
                                    <div className="row border-bottom border-1 mt-2" key={values._id}>
                                        <div className="col-4"><img src={`/uploads/${values.pimage}`} onClick={() => { singleProduct(values._id) }} className='img img-fluid p-1' alt="img" style={{ backgroundColor: "#fafafa", borderRadius: "10px", cursor: "pointer" }} /></div>
                                        <div className="col-8">
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className='mb-0 lead' style={{ fontWeight: "bold" }}>{values.pname}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p className='my-2 lead'>₹ {values.total}.00</p>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-7 mt-1">
                                                    <span className='px-2 py-2' style={{ backgroundColor: "#fafafa", borderRadius: "5px" }}>{values.pcolor}</span>
                                                </div>
                                                <div className="col-5">
                                                    <ButtonGroup variant="contained" size='small' className='p-1'>
                                                        <div style={{ cursor: "pointer" }} onClick={() => { qtyMinus(values._id) }}><Remove color='info' /></div>
                                                        <span className='px-2'>{values.quantity}</span>
                                                        <div style={{ cursor: "pointer" }} onClick={() => { qtyPlus(values._id) }} ><Add color='info' /></div>
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="fixed-bottom">
                        <div className="row">
                            <div className="col-5">
                                <small style={{ color: "gray", fontWeight: "bold" }} >Total Amount</small>
                                <p style={{ fontWeight: "bolder" }}>₹ {totalAmount}</p>
                                <small>Inclusive of all taxes</small>
                            </div>
                            <div className="col-7 d-flex align-items-end">
                                <button className='corder' onClick={()=>{COrder(user.user._id)}}>Confirm Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Menu>
        </> :
            <>
                <Badge badgeContent={"0"} color="primary">
                    <ShoppingCartIcon id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        className="text-light" />
                </Badge>
                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                    <div className="row" style={{ "width": "24rem", "padding": "10px", "display": "flex", 'justifyContent': "center", "alignItems": "center" }} >
                        <div className="col-6" style={{ "fontFamily": "cursive", "fontWeight": "bolder" }}>
                            <p className='mt-2 lead'>{user?.token ? "Your Cart Is Empty" : "Please Log In"}</p>
                        </div>
                        <div className="col-4"><img src={Empty} alt='cart' className='img img-fluid' /></div>
                        <div className="col-2" style={{ "position": "absolute", "right": 0, "top": 3 }}><img src={Close} onClick={handleClose} alt='close' className='img img-fluid' style={{ "cursor": "pointer" }} /></div>
                    </div>
                </Menu>
            </>
    )
}

export default Cart;