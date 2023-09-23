import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "../../../style/Seller.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState('');
    const [storedOtp, setStoredOtp] = useState('');
    const [otp, setOtp] = useState('');
    const [pnumber, setPnumber] = useState('');
    const [fullname, setFulllname] = useState('');
    const [isSend, setIsSend] = useState(false);
    const navigate = useNavigate();

    const sendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Enter The Email Address");
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            toast.error("Enter Valid Email Address")
        } else {
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/sendotp`, {
                    email
                })
                if (res.data.status === 200) {
                    toast.success(`OTP Sent To ${email}`);
                    console.log(res.data);
                    setStoredOtp(res.data.otp)
                    setIsSend(true);
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    const signUpSeller = async (e) => {
        e.preventDefault();
        if (!email || !otp || !storedOtp || !pnumber || !fullname) {
            toast.error("All Field Are Required")
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            toast.error("Enter Valid Email")
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || pnumber.length !== 10) {
            toast.error("Enter Valid Phone Number")
        } else {
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/signupseller`, {
                    email,
                    otp,
                    storedOtp,
                    pnumber,
                    fullname
                })
                if (res.data.status === 200) {
                    const sellerId = res.data.data._id
                    localStorage.setItem('sellerId',sellerId)
                    navigate("/seller/selleronboarding");
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    const tryAgain = () => {
        setEmail('')
        setOtp('');
        setIsSend(false);
    }

    return (
        <div className="container d-flex justify-content-center">
            <form className="form border m-4 p-5" autoComplete='off'>
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='logo'>Create your Seller Account</h1>
                    </div>
                </div>
                {
                    !isSend ? <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <input type="text" className="form-control" onChange={(e) => { setEmail(e.target.value) }} value={email} name='email' placeholder="Enter Your Email ID" />
                            </div>
                        </div>
                        <div className="col-12">
                            <button className='btnAc mt-4 w-100' onClick={sendOtp}>Send Otp</button>
                        </div>
                    </div> : <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <input type="text" className="form-control" value={email} name='email' placeholder="Email Address" disabled />
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <div className="form-group">
                                <input type="text" className="form-control" onChange={(e) => { setOtp(e.target.value) }} value={otp} name='otp' placeholder="Enter OTP Here..." />
                                <small className="text-primary mx-2" style={{ cursor: "pointer" }} onClick={tryAgain}>Didn't receive OTP? Try again</small>
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <div className="form-group">
                                <input type="text" className="form-control" onChange={(e) => setPnumber(e.target.value)} value={pnumber} name='pnumber' placeholder="Enter Your Phone Number" />
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <div className="form-group">
                                <input type="text" className="form-control" onChange={(e) => setFulllname(e.target.value)} value={fullname} name='fullname' placeholder="First and Last Name" />
                            </div>
                        </div>
                        <div className="col-12">
                            <button className='btnAc mt-4 w-100' onClick={signUpSeller}>Sign Up</button>
                        </div>
                    </div>
                }
            </form>
            <Toaster />
        </div>
    )
}

export default Signup;