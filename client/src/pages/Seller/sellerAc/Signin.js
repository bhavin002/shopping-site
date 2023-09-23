import axios from 'axios'
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useSeller } from '../../../context/seller'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const {signIn} = useSeller();   
    const navigate = useNavigate()
     
    const [info, setInfo] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value
        })
    }

    const { email, password } = info;
    let formReadyToSave = email && password;

    const loginAc = async (e) => {
        e.preventDefault();
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            toast.error("Enter Valid Email")
        } else {
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/signinseller`, {
                    email,
                    password
                })
                if (res.data.status === 200) {
                    localStorage.setItem("sellerAuth",JSON.stringify(res.data));
                    signIn(res.data.seller,res.data.token);
                    navigate("/sellerdash/seller")
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

    }
    return (
        <div className="container d-flex justify-content-center">
            <form className="form border m-4 p-5" autoComplete='off'>
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='logo'>Login as seller</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor='email'>Email ID</label>
                            <input type="email" className="form-control" onChange={handleChange} value={info.email} name='email' id='email' placeholder="Enter Email Your ID" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor='password'>Password</label>
                            <input type="password" className="form-control" onChange={handleChange} value={info.password} name='password' id='password' placeholder="password" />
                        </div>
                    </div>
                </div>
                <button className='btn btn-primary mt-3 w-100' onClick={loginAc} disabled={!formReadyToSave}>Login</button>
            </form>
            <Toaster />
        </div>
    )
}

export default Signin;