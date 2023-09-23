import React, { useState } from 'react'
import Usermenu from '../../component/Layout/Account';
import { useUser } from '../../context/user';
import { toast, Toaster } from "react-hot-toast"
import axios from 'axios';

const Profile = () => {
  const { user, login } = useUser();
  const [info, setInfo] = useState({
    fullname: user?.user?.fullname,
    pnumber: user?.user?.pnumber,
    email: user?.user?.email,
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value
    })
  }
  const update = async (e) => {
    e.preventDefault();
    const { fullname, pnumber, email } = info;
    console.log();
    if (!fullname || !pnumber || !email) {
      toast.error("All filed are required");
    } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pnumber) || JSON.stringify(pnumber).length !== 10) {
      toast.error("Enter valid mobile number")
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error("Enter valid email")
    } else {
      try {
        const res = await axios.post(`http://localhost:8081/api/user/updateuserproflie`, {
          fullname,
          pnumber,
          email
        }, {
          headers: {
            Authorization: user.token
          }
        })
        if (res.data.status === 202) {
          login(res.data.update, user.token);
          const ls = JSON.parse(localStorage.getItem("userAuth"));
          ls.user = res.data.update;
          localStorage.setItem("userAuth", JSON.stringify(ls));
          toast.success("Profile Updated Successfully");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <Usermenu />
        </div>
        <div className="col-md-9">
          <div className='heading'>
            <p>Manage Your Profile</p>
          </div>
          <form className='p-1'>
            <div className="row">
              <div className="col-12">
                <label htmlFor="fullname">Name</label>
                <input className='form-control' name='fullname' type="text" onChange={handleChange} value={info.fullname} id='fullname' />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor='pnumber'>Phone Number</label>
                  <input type="number" className="form-control" value={info.pnumber} onChange={handleChange} name='pnumber' id='pnumber' />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label htmlFor="email">email</label>
                <input className='form-control' name='email' type="text" onChange={handleChange} value={info.email} id='email' />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <button className='btnAdd mt-4 w-100' onClick={update}>Update</button>
              </div>
            </div>
          </form>
          <Toaster />
        </div>
      </div>
    </div>
  )
}

export default Profile;