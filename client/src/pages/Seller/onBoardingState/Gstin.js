import axios from 'axios';
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const Gstin = (props) => {
    const [gstin, setGstin] = useState('');
    const [pan, setPan] = useState('');
    const [onBoardingState, setOnBoardingState] = useSearchParams();

    const continueBtn = async (e) => {
        e.preventDefault();
        if (props.gst === 'I have a GSTIN') {
            if (gstin.length !== 15) {
                toast.error("Enter Valid GSTIN Number");
            } else {
                const sellerId = localStorage.getItem("sellerId");
                try {
                    const res = await axios.post(`http://localhost:8081/api/seller/business`, {
                        gstin: gstin
                    }, {
                        headers: {
                            sellerId: sellerId
                        }
                    })
                    if (res.data.status === 201) {
                        setGstin('');
                        if (onBoardingState.get('onBoardingState') === 'getBusinessDetails') {
                            setOnBoardingState({ 'onBoardingState': 'getBankDetails' })
                        }
                    }
                } catch (error) {
                    toast.error(error.response.data.message)
                }
            }
        } else if (props.gst === 'I will only sell in GSTIN exempt categories like books') {
            if (pan.length !== 10) {
                toast.error("Enter Valid PAN Number");
            } else {
                const sellerId = localStorage.getItem("sellerId");
                try {
                    const res = await axios.post(`http://localhost:8081/api/seller/business`, {
                        pan: pan
                    }, {
                        headers: {
                            sellerId: sellerId
                        }
                    })
                    if (res.data.status === 201) {
                        setPan('');
                        if (onBoardingState.get('onBoardingState') === 'getBusinessDetails') {
                            setOnBoardingState({ 'onBoardingState': 'getBankDetails' })
                        }
                    }
                } catch (error) {
                    toast.error(error.response.data.message)
                }
            }
        } else {
            const sellerId = localStorage.getItem("sellerId");
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/business`, {
                    gstin: '',
                    pan: ''
                }, {
                    headers: {
                        sellerId: sellerId
                    }
                })
                if (res.data.status === 201) {
                    if (onBoardingState.get('onBoardingState') === 'getBusinessDetails') {
                        setOnBoardingState({ 'onBoardingState': 'getBankDetails' })
                    }
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    if (props.gst === 'I have a GSTIN') {
        const formReadyToSave = gstin;
        return (
            <>
                <div className="form-group">
                    <input type="text" className="form-control mt-3" name='gstin' value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="GSTIN Number" />
                </div>
                <div className="col-12">
                    <button className='btn btn-primary mt-3 w-100' disabled={!formReadyToSave} onClick={continueBtn}>CONTINUE</button>
                </div>
                <Toaster />
            </>

        )
    } else if (props.gst === 'I will only sell in GSTIN exempt categories like books') {
        const formReadyToSave = pan;
        return (
            <>
                <div className="form-group">
                    <input type="text" className="form-control mt-3" value={pan} onChange={(e) => setPan(e.target.value)} name='pan' placeholder="PAN Number" />
                </div>
                <div className="col-12">
                    <button className='btn btn-primary mt-3 w-100' disabled={!formReadyToSave} onClick={continueBtn}>CONTINUE</button>
                </div>
                <Toaster />
            </>
        )
    } else {
        return (
            <>
                <div className='mt-3'>
                    <p className='title'><b className='text-danger'>Note : </b>GSTIN is mandatory to sell any product other than books.while you get your GSTIN,you can continue with your account set up</p>
                </div>
                <div className="col-12">
                    <button className='btn btn-primary mt-3 w-100' onClick={continueBtn}>CONTINUE</button>
                </div>
                <Toaster />
            </>
        )
    }
}

export default Gstin;