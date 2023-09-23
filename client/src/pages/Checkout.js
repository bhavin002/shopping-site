import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo1 from "../images/logo1.png"
import "../style/Checkout.css"
import { useCart } from '../context/cart'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { useUser } from '../context/user'
import { useSeller } from '../context/seller'

const Checkout = () => {
    const { user } = useUser();
    const { seller } = useSeller();
    const { cartItems, removeAllCart, totalAmount } = useCart();
    const navigate = useNavigate();
    const [onStep, setOnStep] = useSearchParams();
    const { userid } = useParams();
    const [info, setInfo] = useState({
        email: '',
        country: '',
        fname: '',
        lname: '',
        baseaddress: '',
        pincode: '',
        landmark: '',
        city: '',
        state: '',
        pnumber: ''
    })

    useEffect(() => {
        if (!onStep.has('onStep')) {
            onStep.set('onStep', 'contact_info')
            setOnStep(onStep)
        }
    }, [onStep, setOnStep]);

    const getDetail = async () => {
        const res = await axios.get(`http://localhost:8081/api/user/getuserdetails/${userid}`);
        if (res.data.status === 200) {
            const { fullname, pnumber, email, addressObj } = res.data.data;
            const addresses = addressObj.map((addresses) => {
                return addresses
            })
            const defaultAddress = addresses.filter((values) => {
                return values.isDefault === true
            })
            const { baseaddress, pincode, landmark, city, state } = defaultAddress[0];
            setInfo({
                ...info,
                email: email,
                country: "India",
                fname: fullname.split(" ")[0],
                lname: fullname.split(" ")[1],
                baseaddress: baseaddress,
                pincode: pincode,
                landmark: landmark,
                city: city,
                state: state,
                pnumber: pnumber

            })
        }
    }
    const { email, country, fname, lname, baseaddress, pincode, landmark, city, state, pnumber } = info;
    const readyForPayment = email && country && fname && lname && baseaddress && pincode && landmark && city && state && pnumber;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value
        })
    }

    useEffect(() => {
        getDetail();
        // eslint-disable-next-line
    }, [])

    const ctopay = (e) => {
        e.preventDefault();
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            toast.error("Enter The Valid Email")
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pincode) || JSON.stringify(pincode).length !== 6) {
            toast.error("Enter Valid Phone Number")
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || JSON.stringify(pnumber).length !== 10) {
            toast.error("Enter Valid Phone Number")
        } else {
            if (onStep.get("onStep") === "contact_info") {
                setOnStep({ "onStep": "payment_info" })
            }
        }
    }

    const [selected, setSelected] = useState('online payment');

    const handleRadio = (e) => {
        setSelected(e.target.value)
    }
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const readyToPlace = cardName && cardNumber && expiryDate;

    const handleCardNumber = (event) => {
        let inputValue = event.target.value.replace(/\s/g, ''); // Remove any existing spaces
        inputValue = inputValue.replace(/(\d{4})/g, '$1 ').trim(); // Add a space after every four digits
        setCardNumber(inputValue);
    };

    const listingModifyByStock = async () => {
        try {
            await axios.get(`http://localhost:8081/api/seller/listingmodifybystock`, {
                headers: {
                    "Authorization": seller.token
                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    const payTotal = async (ptype) => {
        if (ptype === "online") {
            if (!cardNumber || !cardName || !expiryDate) {
                toast.error("Fill The Valid Card Details");
            } else if (cardNumber !== "4242 4242 4242 4242") {
                toast.error("Invalid Card Number");
            } else if (expiryDate !== "2026-06") {
                toast.error("Invalid Expiry Date");
            } else {
                const res = await axios.post(`http://localhost:8081/api/user/placedorder`, {
                    userid: user?.user._id,
                    ptype: ptype,
                    payment: "done",
                    products: JSON.stringify(cartItems),
                    totalAmount: totalAmount
                })

                if (res.data.status === 201) {
                    removeAllCart();
                    listingModifyByStock();
                    navigate("/dashboard/user/order")
                }
            }
        } else {
            const res = await axios.post(`http://localhost:8081/api/user/placedorder`, {
                userid: user?.user._id,
                ptype: ptype,
                payment: "pending",
                products: JSON.stringify(cartItems),
                totalAmount: totalAmount
            })

            if (res.data.status === 201) {
                removeAllCart();
                listingModifyByStock();
                navigate("/dashboard/user/order")
            }
        }
    }

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="row">
                    <div className="col-12">
                        <img src={Logo1} alt="logo1" width={"180px"} />
                    </div>
                </div>
                <div className="row">
                    {
                        onStep.get("onStep") === "contact_info" ? (<div className="col-6">
                            <div className="row my-4">
                                <div className="col-12">
                                    <span className='delivertTitle py-2' >DELIVERY ADDRESS</span>
                                </div>
                            </div>
                            <form autoComplete='off' className='px-2'>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor='email' className='my-2'>Email</label>
                                        <input type="email" className='form-control' name="email" id="email" onChange={handleChange} value={info.email} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 d-flex align-item-center">
                                        <input type="checkbox" name="checkBtn" id="checkBtn" className='mx-2' defaultChecked={true} />
                                        <small style={{ fontFamily: "cursive" }} className='text-secondary'>We'll send the bill to your email</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor="country" className='my-2'>Country/region</label>
                                        <input type="text" name="country" id="country" className='form-control' onChange={handleChange} value={info.country} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="fname" className='my-2'>First Name</label>
                                        <input type="text" name="fname" id="fname" className='form-control' onChange={handleChange} value={info.fname} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="lname" className='my-2'>Last Name</label>
                                        <input type="text" name="lname" id="lname" className='form-control' onChange={handleChange} value={info.lname} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor="address" className='my-2'>Address</label>
                                        <input type="text" name="address" id="address" className='form-control' onChange={handleChange} value={info.baseaddress} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="pincodes" className='my-2'>Pincode</label>
                                        <input type="text" name="pincodes" id="pincodes" className='form-control' onChange={handleChange} value={info.pincode} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="landmark" className='my-2'>Landmark</label>
                                        <input type="text" name="landmark" id="landmark" className='form-control' onChange={handleChange} value={info.landmark} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="city" className='my-2'>City</label>
                                        <input type="text" name="city" id="city" className='form-control' onChange={handleChange} value={info.city} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="state" className='my-2'>State</label>
                                        <input type="text" name="state" id="state" className='form-control' onChange={handleChange} value={info.state} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor="pnumber" className='my-2'>Phone Number</label>
                                        <input type="text" name="pnumber" id="pnumber" className='form-control' onChange={handleChange} value={info.pnumber} />
                                    </div>
                                    <div className="col-12">
                                        <small style={{ fontFamily: "cursive" }} className='text-danger mx-1'>Please enter correct phone number</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <button className='paymentBtns' onClick={ctopay} disabled={!readyForPayment}>Continue to payment</button>
                                    </div>
                                </div>
                            </form>
                        </div>) : (
                            onStep.get("onStep") === "payment_info" ? (
                                <div className="col-6">
                                    <div className="row my-4">
                                        <div className="col-11">
                                            <span className='delivertTitle py-2'>PAYMENT METHODS</span>
                                        </div>
                                    </div>
                                    <div className="row mt-4 my-3">
                                        <div className='col-1'>
                                            <input className="form-check-input m-2" type="radio" name="payment" id="online" onChange={handleRadio} value="online payment" checked={selected === "online payment"} />
                                        </div>
                                        <div className="col-11">
                                            <label htmlFor='online' className='my-0 paymentLabel'>Online Payment With Debit/Credit/ATM Cards</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1">
                                            <input className="form-check-input m-2" type="radio" name="payment" id="offline" onChange={handleRadio} value="cash on delivery" checked={selected === "cash on delivery"} />
                                        </div>
                                        <div className="col-11">
                                            <label htmlFor='offline' className='my-0 paymentLabel'>Cash On Delivery</label>
                                        </div>
                                    </div>
                                    {
                                        selected === "online payment" ? (
                                            <div className="paymentCard">
                                                <div className="row py-2">
                                                    <div className="col-12">
                                                        <p className="cardTitle">Enter Card Details</p>
                                                    </div>
                                                </div>
                                                <div className="row my-2">
                                                    <div className="col-4">
                                                        <label className='my-0' htmlFor='cardnumber'>Card number</label>
                                                    </div>
                                                    <div className="col-1">
                                                        <p className='lead'>:</p>
                                                    </div>
                                                    <div className="col-7">
                                                        <input type="text" className='form-control' value={cardNumber} onChange={handleCardNumber} name='cardnumber' id='cardnumber' />
                                                    </div>
                                                </div>
                                                <div className="row my-2">
                                                    <div className="col-4">
                                                        <label className='my-0' htmlFor='cardname'>Name on card</label>
                                                    </div>
                                                    <div className="col-1">
                                                        <p className='lead'>:</p>
                                                    </div>
                                                    <div className="col-7">
                                                        <input type="text" className='form-control' value={cardName} onChange={(e) => setCardName(e.target.value)} name='cardname' id='cardname' />
                                                    </div>
                                                </div>
                                                <div className="row my-2">
                                                    <div className="col-4">
                                                        <label className='my-0' htmlFor='edate'>Expiry date</label>
                                                    </div>
                                                    <div className="col-1">
                                                        <p className='lead'>:</p>
                                                    </div>
                                                    <div className="col-7">
                                                        <input type="month" className='form-control' value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} name='edate' id='edate' />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <button className='paymentBtns mt-3' onClick={() => { payTotal("online") }} disabled={!readyToPlace}>Place Order And Pay</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="paymentCard">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <button className='paymentBtns mt-3' onClick={() => { payTotal("cod") }}>Place Order</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                            ) : null
                        )
                    }
                    <div className="col-6">
                        <div className="row my-4">
                            <div className="col-12">
                                <span className='delivertTitle py-2' >ORDER SUMMARY</span>
                            </div>
                        </div>
                        <div className="order_summary">
                            {
                                cartItems.map((values) => {
                                    return (
                                        <div className="row py-2" style={{ borderBottom: "1px solid gray" }} key={values._id}>
                                            <div className="col-3">
                                                <img src={`/uploads/${values.pimage}`} className='img img-fluid mx-2' alt={values.pname} style={{ backgroundColor: "#fafafa", borderRadius: "10px" }} />
                                            </div>
                                            <div className="col-9">
                                                <small style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }} className='text-secondary'>{values.pdescription} <br /> <span style={{ fontFamily: "cursive" }} className='text-dark'>Color</span> : {values.pcolor} <br /> <span style={{ fontFamily: "cursive" }} className='text-dark'>Price</span> : ₹{values.pprice}.00 <br /> <span style={{ fontFamily: "cursive" }} className='text-dark'>Quantity</span> : {values.quantity}</small>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="subTotal">
                            <div className="row">
                                <div className="col-12 d-flex justify-content-between">
                                    <p>Subtotal</p>
                                    <p>₹{totalAmount}.00</p>
                                </div>
                            </div>
                            <div className="row py-2" style={{ borderBottom: "1px solid gray" }}>
                                <div className="col-12 d-flex justify-content-between">
                                    <p>Shipping</p>
                                    <p className='text-success'>Free</p>
                                </div>
                            </div>
                            <div className="row py-2">
                                <div className="col-12 d-flex justify-content-between">
                                    <p style={{ fontWeight: "bolder" }}>To Pay</p>
                                    <p>₹{totalAmount}.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Checkout;