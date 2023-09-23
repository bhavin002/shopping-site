import React, { useEffect, useState } from 'react'
import "../style/Single.css";
import Paytm from "../images/payment/paytm.png"
import GooglePe from "../images/payment/googlpe.png"
import PhonePe from "../images/payment/phonepe.png"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useCart } from '../context/cart';
import { useUser } from '../context/user';

const SingleProduct = () => {
    const { id } = useParams();
    const [listing, setListing] = useState({});
    const [isFetched, setIsFetched] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const getProduct = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8081/api/seller/listing/siglelisting/${id}`);
            if (res.data.status === 200) {
                console.log(res.data.data);
                setListing(res.data.data);
                setIsFetched(true)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProduct(id);
        // eslint-disable-next-line
    }, [id])


    const addItem = (_id, pname, pprice, pcolor, pdescription, pimage) => {
        if (!user?.token) {
            navigate("/login");
        } else {
            addToCart(_id, pname, pprice, pcolor, pdescription, pimage);
            toast.success("Item Add Suuccessfully into cart");
        }
    }


    return (
        <div className="container">
            {
                isFetched && <div className="row my-5">
                    <div className="col-6">
                        <img src={`/uploads/${listing.listingInfoObj.product.pimage}`} alt={listing.listingInfoObj.product.pname} className='img img-fluid product_img' />
                    </div>
                    <div className="col-6 py-4 px-5">
                        <p className="pname">{listing.listingInfoObj.product.pname}</p>
                        <p className="pdescription">{listing.listingInfoObj.product.pdescription}</p>
                        <p className="pprice">₹ {listing.listingInfoObj.product.pprice}.00</p>
                        <p className='pcolor'>The Item Looks Beautiful By <span style={{ color: "black" }}>{listing.listingInfoObj.product.pcolor}</span> Color</p>
                        <div className="row mt-4 d-flex align-items-center payment">
                            <div className="col-7">
                                <p className="lead">₹15 Off on All UPI Payments</p>
                            </div>
                            <div className="col-5 d-flex justify-content-around">
                                <img src={Paytm} alt="Paytm" width="40px" />
                                <img src={GooglePe} alt="GooglePe" width="40px" />
                                <img src={PhonePe} alt="PhonePe" width="40px" />
                            </div>
                        </div>
                        <p className="pbrand text-center">{listing.listingInfoObj.product.pbrand}</p>
                        <button className='addBtn w-100' onClick={() => { addItem(listing._id, listing.listingInfoObj.product.pname, listing.listingInfoObj.product.pprice, listing.listingInfoObj.product.pcolor, listing.listingInfoObj.product.pdescription, listing.listingInfoObj.product.pimage) }}>Add To Cart</button>
                    </div>
                </div>
            }
            <Toaster />
        </div>
    )
}

export default SingleProduct;