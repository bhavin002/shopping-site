import React, { useState} from 'react'
import "../../../style/Form.css"
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios"

const Register = () => {
  
  const [info, setInfo] = useState({
    fullname: "",
    pnumber: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value
    })
  }

  const createAc = async (e) => {
    e.preventDefault();
    const { fullname, pnumber, email, password } = info;
    if (!fullname || !pnumber || !email || !password) {
      toast.error("All filed are required");
    } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || pnumber.length !== 10) {
      toast.error("Enter valid mobile number")
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error("Enter valid email")
    } else {
      try {
        const res = await axios.post(`http://localhost:8081/api/user/registeruser`, {
          fullname,
          pnumber,
          email,
          password
        })
        if (res.data && res.data.success === true) {
          toast.success("Account created successfully");
          setInfo({ ...info, fullname: '', pnumber: '', email: '', password: '' });
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
              <h1 className='logo'>Create Account</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor='fullname'>Enter your name</label>
                <input type="text" className="form-control" value={info.fullname} onChange={handleChange} name='fullname' id='fullname' placeholder="First and last name" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor='pnumber'>Mobile Number</label>
                <input type="text" className="form-control" value={info.pnumber} onChange={handleChange} name='pnumber' id='pnumber' placeholder="Mobile Number" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor='email'>Email</label>
                <input type="email" className="form-control" value={info.email} onChange={handleChange} name='email' id='email' placeholder="Email address" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor='password'>Password</label>
                <input type="password" className="form-control" value={info.password} onChange={handleChange} name='password' id='password' placeholder="Password" />
              </div>
            </div>
          </div>
          <button className='btnRegister mt-3 w-100' onClick={createAc}>Create Account</button>
        </form>
        <Toaster />
      </div>
    </>
  )
}

export default Register;