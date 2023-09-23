import axios from 'axios';
import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const Getbankdetails = () => {
    const [selected, setSelected] = useState('I have a bank account in my registerd business name');
    const [info, setInfo] = useState({
        acholder: '',
        acnumber: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name]: value
        })
    }

    const [onBoardingState, setOnBoardingState] = useSearchParams();

    const handleRadio = (e) => {
        setSelected(e.target.value)
    }

    const formReadyToSave = info.acholder && info.acnumber

    const continueBtn = async (e) => {
        e.preventDefault();
        if (selected === 'I have a bank account in my registerd business name') {
            const { acholder, acnumber } = info;
            if (acnumber.length !== 11) {
                toast.error("Enter Valid Account Number");
            } else {
                const sellerId = localStorage.getItem("sellerId");
                try {
                    const res = await axios.post(`http://localhost:8081/api/seller/bank`, {
                        acholder: acholder,
                        acnumber: acnumber
                    }, {
                        headers: {
                            sellerId: sellerId
                        }
                    })

                    if (res.data.status === 201) {
                        setInfo({ ...info, acholder: '', acnumber: '' });
                        if (onBoardingState.get('onBoardingState') === 'getBankDetails') {
                            setOnBoardingState({ 'onBoardingState': 'onSellerBoarding' })
                        }
                    }
                } catch (error) {
                    toast.error(error.response.data.message)
                }

            }
        } else {
            const sellerId = localStorage.getItem("sellerId");
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/bank`, {
                    acholder: '',
                    acnumber: ''
                }, {
                    headers: {
                        sellerId: sellerId
                    }
                })
                if (res.data.status === 201) {
                    if (onBoardingState.get('onBoardingState') === 'getBankDetails') {
                        setOnBoardingState({ 'onBoardingState': 'onSellerBoarding' })
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
                        <h1 className='logo'>Give your Bank Details</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input p-0 mt-2" onChange={handleRadio} type="radio" name="bank" id="firstRadioButton" value="I have a bank account in my registerd business name" checked={selected === 'I have a bank account in my registerd business name'} />
                            <label className="form-check-label m-0 p-0" htmlFor="firstRadioButton">
                                I have a bank account in my registerd business name
                            </label>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input p-0 mt-2" onChange={handleRadio} type="radio" name="bank" id="secondRadioButton" value="I have applied/will apply for Bank Account in my registerd business" checked={selected === 'I have applied/will apply for Bank Account in my registerd business'} />
                            <label className="form-check-label m-0 p-0" htmlFor="secondRadioButton">
                                I have applied/will apply for Bank Account in my registerd business
                            </label>
                        </div>
                    </div>
                </div>
                {
                    selected === 'I have a bank account in my registerd business name' ?
                        <>
                            <div className="row mt-1">
                                <div className="col-12 my-2">
                                    <div className="form-group">
                                        <input type="text" className="form-control" onChange={handleChange} value={info.acholder} name='acholder' placeholder="Enter account holder's name" />
                                    </div>
                                </div>
                                <div className="col-12  my-2">
                                    <div className="form-group">
                                        <input type="text" className="form-control" onChange={handleChange} value={info.acnumber} name='acnumber' placeholder="Enter bank account number" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className='btn btn-primary mt-3 w-100' onClick={continueBtn} disabled={!formReadyToSave}>CONTINUE</button>
                                </div>
                            </div>

                        </> : <>
                            <div className='mt-3'>
                                <p className='title'><b className='text-danger'>Note : </b>A bank account in your registered business name is mandatory to do business on amazon while you get a bank account in your registerd business name, you can continue your account set up.</p>
                            </div>
                            <div className="col-12">
                                <button className='btn btn-primary mt-3 w-100' onClick={continueBtn}>CONTINUE</button>
                            </div>
                        </>
                }
            </form>
            <Toaster />
        </div>
    )
}

export default Getbankdetails;