import React, { useState } from 'react'
import "../../../style/Form.css"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useUser } from '../../../context/user';
import { useCart } from '../../../context/cart';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { getCart } = useCart();

  const [info, setInfo] = useState({
    email: "",
    password: ""
  });

  const createAc = (e) => {
    e.preventDefault();
    navigate("/register");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value
    })
  }

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = info;
    if (!email || !password) {
      toast.error("All fileds are requires");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error("Enter valid email")
    } else {
      try {
        const res = await axios.post(`http://localhost:8081/api/user/loginuser`, {
          email,
          password
        })
        if (res.data && res.data.success === true) {
          localStorage.setItem("userAuth", JSON.stringify(res.data));
          login(res.data.user, res.data.token)
          getCart(res.data.user._id)
          navigate("/dashboard/user");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }
  return (
    <>
      <div className="container d-flex justify-content-center">
        <form className="form border m-4 p-5" autoComplete='off'>
          <div className="row">
            <div className="col-md-12">
              <h1 className='logo'>Sign In</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Email</label>
                <input type="email" onChange={handleChange} value={info.email} className="form-control" name='email' placeholder="Email address" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Password</label>
                <input type="password" onChange={handleChange} value={info.password} className="form-control" name='password' placeholder="Password" />
              </div>
            </div>
          </div>
          <button className='btnLogin mt-3 w-100' onClick={loginUser}>Login</button>
          <div className="text-center mt-3">
            <h5 className='text-danger'>New to Amazon?</h5>
            <button className='btn btn-warning mt-3' onClick={createAc}>Create your Amazon account</button>
          </div>
        </form>
        <Toaster />
      </div>
    </>
  )

}

export default Login;