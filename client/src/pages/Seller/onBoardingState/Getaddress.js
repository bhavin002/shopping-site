import axios from 'axios';
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom';
const Getaddress = () => {
    const [onBoardingState, setOnBoardingState] = useSearchParams();
    const [info, setInfo] = useState({
        pincode: '',
        baseaddress: '',
        assv: '',
        landmark: '',
        city: '',
        state: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value
        })
    }
    const { pincode, baseaddress, assv, landmark, city, state } = info;
    const isFormReadyToSave = pincode && baseaddress && assv && landmark && city && state;

    const saveAddress = async (e) => {
        e.preventDefault();
        if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(pincode) || pincode.length !== 6) {
            toast.error("Enter valid pincode number")
        } else {
            const sellerId = localStorage.getItem("sellerId")
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/address`, {
                    pincode,
                    baseaddress,
                    assv,
                    landmark,
                    city,
                    state
                }, {
                    headers: {
                        sellerId: sellerId
                    }
                })
                if (res.data.status === 201) {
                    if (onBoardingState.get('onBoardingState') === 'getAddressDetails') {
                        setOnBoardingState({ 'onBoardingState': 'getBusinessDetails' })
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
                        <h1 className='logo'>Give Your Pick Up Address</h1>
                    </div>
                </div>
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text" onChange={handleChange} value={info.pincode} className="form-control" name='pincode' placeholder="6 digits [0-9] PIN code" />
                        </div>
                    </div>
                </div>
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text" onChange={handleChange} value={info.baseaddress} className="form-control" name='baseaddress' placeholder="Flat, House no, Building, Company, Apartment" />
                        </div>
                    </div>
                </div>
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text" onChange={handleChange} value={info.assv} className="form-control" name='assv' placeholder="Area,Street,Sector,Village" />
                        </div>
                    </div>
                </div>
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text" onChange={handleChange} value={info.landmark} className="form-control" name='landmark' placeholder="Landmark" />
                        </div>
                    </div>
                </div>
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text" onChange={handleChange} value={info.city} className="form-control" name='city' placeholder="City" />
                        </div>
                    </div>
                </div>
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text" onChange={handleChange} value={info.state} className="form-control" name='state' placeholder="State" />
                        </div>
                    </div>
                </div>
                <button className='btn btn-primary mt-3 w-100' disabled={!isFormReadyToSave} onClick={saveAddress}>CONTINUE</button>
            </form>
            <Toaster />
        </div>
    )
}

export default Getaddress;