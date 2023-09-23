import React, { useEffect, useState } from 'react'
import "../../../style/SellerBoarding.css"
import Store from "../../../images/store.png"
import Business from "../../../images/business.png"
import Bank from "../../../images/bank.png"
import axios from "axios"
import { toast, Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Sellerboarding = () => {
    const [storeName, setStoreName] = useState(null);
    const [isStore, setIsStore] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [isBank, setIsBank] = useState(false);
    const [per, setPer] = useState(25);
    const navigate = useNavigate();

    const getSeller = async () => {
        try {
            const sellerId = localStorage.getItem("sellerId");
            const res = await axios.get(`http://localhost:8081/api/seller/getseller`, {
                headers: {
                    sellerId: sellerId
                }
            })
            if (res.data.status === 200) {
                let process = 25;
                if (res.data.data.storeObj.length > 0) {
                    const { dname, sdescription } = res.data.data.storeObj[0];
                    if (dname && sdescription) {
                        setIsStore(true)
                        setStoreName(dname)
                        process += 25;
                    }
                }
                if (res.data.data.businessObj.length > 0) {
                    const { gstin } = res.data.data.businessObj[0];
                    if (gstin) {
                        setIsBusiness(true)
                        process += 25;
                    }
                }
                if (res.data.data.bankObj.length > 0) {
                    const { acholder, acnumber } = res.data.data.bankObj[0];
                    if (acholder && acnumber) {
                        setIsBank(true)
                        process += 25;
                    }
                }
                if(isStore && isBusiness && isBank){
                    localStorage.removeItem("sellerId")
                    navigate("/seller/signin")
                }
                setPer(process)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        getSeller()
    })

    const [storeData, setStoreData] = useState({
        dname: '',
        sdescription: ''
    })

    const [gstin, setGstIn] = useState('');

    const [acData, setAcData] = useState({
        acholder: '',
        acnumber: ''
    })

    const handleStoreChnage = (e) => {
        const { name, value } = e.target;
        setStoreData({
            ...storeData,
            [name]: value
        })
    }
    const handleAcChnage = (e) => {
        const { name, value } = e.target;
        setAcData({
            ...acData,
            [name]: value
        })
    }
    const { dname, sdescription } = storeData;
    let storeReadyToSave = dname && sdescription;

    const { acholder, acnumber } = acData;
    let acReadyToSave = acholder && acnumber;

    const saveStore = async (e) => {
        e.preventDefault();
        try {
            const sellerId = localStorage.getItem("sellerId");
            const res = await axios.post(`http://localhost:8081/api/seller/store`, {
                dname,
                sdescription
            }, {
                headers: {
                    sellerId: sellerId
                }
            })

            if (res.data.status === 201) {
                getSeller();
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const saveBusiness = async (e) => {
        e.preventDefault();
        try {
            const sellerId = localStorage.getItem("sellerId");
            if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(gstin) || gstin.length !== 15) {
                toast.error("Enter Valid GSTIN")
            } else {
                const res = await axios.post(`http://localhost:8081/api/seller/updatebusiness`, {
                    gstin
                }, {
                    headers: {
                        sellerId: sellerId
                    }
                })

                if (res.data.status === 200) {
                    getSeller();
                }
            }


        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const saveAc = async (e) => {
        e.preventDefault();
        try {
            const sellerId = localStorage.getItem("sellerId");
            if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(acnumber) || acnumber.length !== 11) {
                toast.error("Enter Valid Account Number")
            } else {
                const res = await axios.post(`http://localhost:8081/api/seller/updatebank`, {
                    acholder,
                    acnumber
                }, {
                    headers: {
                        sellerId: sellerId
                    }
                })
                if (res.data.status === 200) {
                    getSeller();
                }
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-9">
                    <div className="row">
                        <div className="col-12">
                            <p className='lead my-2'>You are almost ready to start selling!</p>
                            <p className="title my-2">Please complete all the steps below</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-around text-center">
                            <div className="boxOfsteps">
                                <p>Email</p>
                                <p className='verified'>VERIFIED</p>
                            </div>
                            <div className="boxOfsteps">
                                <p>Store</p>
                                <p className={isStore ? 'verified' : 'provided'}>{isStore ? "PROVIDED" : "NOT PROVIDED"}</p>
                            </div>
                            <div className="boxOfsteps">
                                <p>Business</p>
                                <p className={isBusiness ? 'verified' : 'provided'}>{isBusiness ? "PROVIDED" : "NOT PROVIDED"}</p>
                            </div>
                            <div className="boxOfsteps">
                                <p>Bank</p>
                                <p className={isBank ? 'verified' : 'provided'}>{isBank ? "PROVIDED" : "NOT PROVIDED"}</p>
                            </div>
                        </div>
                    </div>
                    {
                        !isStore && <div className="row mt-4" >
                            <div className="col-1 mt-2">
                                <img src={Store} alt="store" className='img img-fluid' />
                            </div>
                            <div className="col-11 p-3" style={{ backgroundColor: "rgb(240, 238, 238)", border: "2px solid #2a3757", borderRadius: "10px" }}>
                                <p className='title'>Store Details</p>
                                <p>Your Store details will be displayed to the buyers when they browse your products :</p>
                                <div className="form-group my-3">
                                    <input type="text" className="form-control" onChange={handleStoreChnage} value={storeData.dname} name='dname' placeholder="Enter your Display Name" />
                                </div>
                                <div className="form-group my-2">
                                    <textarea className="form-control" onChange={handleStoreChnage} value={storeData.sdescription} name='sdescription' rows="3" placeholder='Enter your Store Description'></textarea>
                                </div>
                                <button className='btn btn-primary px-5 mt-2' onClick={saveStore} disabled={!storeReadyToSave}>Save</button>
                            </div>
                        </div>
                    }
                    {
                        !isBusiness && <div className="row mt-4" >
                            <div className="col-1 mt-2">
                                <img src={Business} alt="business" className='img img-fluid' />
                            </div>
                            <div className="col-11 p-3" style={{ backgroundColor: "rgb(240, 238, 238)", border: "2px solid #2a3757", borderRadius: "10px" }}>
                                <p className='title'>Business Details</p>
                                <p>If you sell all type of product so GSTIN is mandatory :  </p>
                                <div className="form-group my-3">
                                    <input type="text" className="form-control" onChange={(e) => setGstIn(e.target.value)} value={gstin} name='gstin' placeholder="GSTIN Number" />
                                </div>
                                <button className='btn btn-primary px-5 mt-2' onClick={saveBusiness} disabled={!gstin}>Save</button>
                            </div>
                        </div>
                    }
                    {
                        !isBank && <div className="row mt-4" >
                            <div className="col-1 mt-2">
                                <img src={Bank} alt="bank" className='img img-fluid' />
                            </div>
                            <div className="col-11 p-3" style={{ backgroundColor: "rgb(240, 238, 238)", border: "2px solid #2a3757", borderRadius: "10px" }}>
                                <p className='title'>Bank Details</p>
                                <p>There is where we will make your payments : </p>
                                <div className="form-group">
                                    <input type="text" className="form-control my-2" onChange={handleAcChnage} value={acData.acholder} name='acholder' placeholder="Enter account holder's name" />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control my-2" onChange={handleAcChnage} value={acData.acnumber} name='acnumber' placeholder="Enter bank account number" />
                                </div>
                                <p className='mx-2'><span className='text-danger'>Note : </span>Please make sure the bank account is in the same name as the GSTIN</p>
                                <button className='btn btn-primary mt-3 w-100' onClick={saveAc} disabled={!acReadyToSave}>Save</button>
                            </div>
                        </div>
                    }
                </div>
                <div className="col-3 mt-5">
                    <div className="sideSteps mt-4">
                        <div className="row d-flex align-items-center">
                            <div className="col-3">
                                <img src={Store} alt="store" className='img img-fluid' />
                            </div>
                            <div className="col-9 p-0">
                                <p>{storeName ? storeName : "Your Store Name appear here"}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: `${per}%` }} aria-valuenow={per} aria-valuemin="0" aria-valuemax="100">{per}%</div>
                                </div>
                            </div>
                            <div className="col-12 my-2">
                                <p>Your Account is <b>{per}%</b> complete</p>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-12">
                                <p className="title" >Account Details</p>
                            </div>
                            <div className="col-12 mx-5">
                                <p>✅Email Verification</p>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-12">
                                <p className="title" >Business Details</p>
                            </div>
                            <div className="col-12 mx-5">
                                <p>{isBusiness ? "✅" : "❌"}GSTIN</p>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-12">
                                <p className="title" >Bank Account Details</p>
                            </div>
                            <div className="col-12 mx-5">
                                <p>{isBank ? "✅" : "❌"}Bank Acc. Verification</p>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-12">
                                <p className="title">{isStore ? "✅" : "❌"}Store Details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Sellerboarding;