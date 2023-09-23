import React, { useState } from 'react'
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useUser } from '../../context/user';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const Addaddress = () => {

    const navigate = useNavigate();
    const { user } = useUser();
    const [info, setInfo] = useState({
        pincode: "",
        baseaddress: "",
        assv: "",
        landmark: "",
        city: "",
        state: ""
    })

    const handleChnage = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value
        })
    }

    const addAddress = async (e) => {
        e.preventDefault();
        const { pincode, baseaddress, assv, landmark, city, state } = info;
        if (!pincode || !baseaddress || !assv || !landmark || !city || !state) {
            toast.error("All Fileds Are Required");
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pincode) || pincode.length !== 6) {
            toast.error("Enter valid Pincode number")
        } else {
            try {
                const res = await axios.post(`http://localhost:8081/api/user/addaddress`, {
                    pincode,
                    baseaddress,
                    assv,
                    landmark,
                    city,
                    state,
                }, {
                    headers: {
                        "Authorization": user.token
                    }
                })
                if (res.data.status === 201) {
                    navigate("/dashboard/user/address");
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    const addNew = () => {
        navigate("/dashboard/user/addaddress");
    }


    return (
        <div className="container">
            <div className="row my-4">
                <div className="col-1">
                    <KeyboardBackspaceIcon style={{ fontSize: "40px", cursor: "pointer" }} />
                </div>
                <div className="col-11 text-center">
                    <p className='acTitle'>Add New Address</p>
                </div>
            </div>
            <div className='row'>
                <div className="col-4">
                    <div className='addressBox text-center pt-5'>
                        <p className='plus'>+</p>
                        <button className='btnAdd' onClick={addNew}>Add New address</button>
                    </div>
                </div>
                <div className="col-md-8">
                    <form autoComplete='off'>
                        <div className="row my-4">
                            <div className="col-6">
                                <input className='form-control' name='pincode' onChange={handleChnage} value={info.pincode} type="text" placeholder='6 digits [0-9] PIN code' />
                            </div>
                            <div className="col-6">
                                <input className='form-control' name='baseaddress' onChange={handleChnage} value={info.baseaddress} type="text" placeholder='Flat, House no., Building, Company, Apartment' />
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-6">
                                <input className='form-control' name='assv' onChange={handleChnage} value={info.assv} type="text" placeholder='Area, Street, Sector, Village' />
                            </div>
                            <div className="col-6">
                                <input className='form-control' name='landmark' onChange={handleChnage} value={info.landmark} type="text" placeholder='Landmark' />
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-6">
                                <input className='form-control' name='city' onChange={handleChnage} value={info.city} type="text" placeholder='City' />
                            </div>
                            <div className="col-6">
                                <input className='form-control' name='state' onChange={handleChnage} value={info.state} type="text" placeholder='State' />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button className='btnAdd w-100' onClick={addAddress}>Add Address</button>
                            </div>
                        </div>
                    </form>
                    <Toaster />
                </div>
            </div>
        </div>

    )
}

export default Addaddress;