import axios from 'axios';
import React, { useState } from 'react'
import toast, { Toaster } from "react-hot-toast"
import { useSearchParams } from 'react-router-dom';

const Getpassword = () => {
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    let [isWeak, setIsWeak] = useState(false);
    let [isMedium, setIsMedium] = useState(false);
    let [isStrong, setIsStrong] = useState(false);

    const [onBoardingState, setOnBoardingState] = useSearchParams();

    const handlePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const checkPasswordStrength = (password) => {

        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = 0;
        if (password.length >= minLength) { strength += 1; }
        if (hasUppercase) { strength += 1; }
        if (hasLowercase) { strength += 1; }
        if (hasNumber) { strength += 1; }
        if (hasSpecialChar) { strength += 1; }

        if (strength === 5) {
            setIsStrong(true)
        } else if (strength >= 3) {
            setIsMedium(true)
        } else {
            setIsWeak(true)
        }
    };

    const isFormReadyToSubmit = password && cpassword && isWeak && isMedium && isStrong

    const setPasswordToSave = async (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            toast.error("Password Or Confrim Password Deos Not Matched")
        } else {
            try {
                const sellerId = localStorage.getItem("sellerId")
                const res = await axios.post(`http://localhost:8081/api/seller/password`, {
                    password,
                    cpassword
                }, {
                    headers: {
                        sellerId: sellerId
                    }
                })
                if (res.data.status === 201) {
                    setPassword('');
                    setCPassword('');
                    setIsWeak(false);
                    setIsMedium(false);
                    setIsStrong(false);
                    if (onBoardingState.get('onBoardingState') === 'getPasswordDetails') {
                        setOnBoardingState({ 'onBoardingState': 'getAddressDetails' })
                    }
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }

        }
    }

    return (
        <div className="container d-flex justify-content-center">
            <form className="form border m-4 p-5" autoComplete='off'>
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='logo'>Set your Password</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={handlePassword} value={password} className="form-control" name='password' placeholder="Password must be 8 characters" />
                        </div>
                    </div>
                </div>
                {
                    <div className="row py-2">
                        <div className="col-12 py-1">{isStrong ? "✅" : "❌"} <span className='title'>Your Password is Strong</span></div>
                        <div className="col-12 py-1">{isMedium ? "✅" : "❌"} <span className="title">Your Password is Medium</span></div>
                        <div className="col-12 py-1">{isWeak ? "✅" : "❌"} <span className="title">Your Password Weak</span> </div>
                    </div>
                }
                <div className="row">
                    <div className="col-12">
                        <b className="text-danger">Note :</b> <span className='text-danger'>Password must contain at least one lowercase, at least one uppercase, at least one digit, and at least one special character such as (!@#$%^&*).</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" onChange={(e) => setCPassword(e.target.value)} value={cpassword} className="form-control" name='cpassword' placeholder="confirm password" />
                        </div>
                    </div>
                </div>
                <button className='btn btn-primary mt-3 w-100' onClick={setPasswordToSave} disabled={!isFormReadyToSubmit}>SET PASSWORD</button>
            </form>
            <Toaster />
        </div>
    )
}

export default Getpassword;