import React, { useEffect, useState } from 'react'
import "../style/Single.css";
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useCart } from '../context/cart';
import { useUser } from '../context/user';

const SingleCategory = () => {

    const { category } = useParams();
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();
    const {user} = useUser();
    const {addToCart} = useCart();
    const getCategoryByProducts = async (category) => {
        try {
            const res = await axios.get(`http://localhost:8081/api/seller/listing/siglecategory/${category}`);
            if (res.data.status === 200) {
                setListings(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategoryByProducts(category);
        // eslint-disable-next-line
    }, [])

    const singleProduct = (id) => {
        navigate(`/product/${id}`)
    }

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
            <div className="row mt-4 mb-5">
                <div className="col-12">
                    <span className="cname">{category}</span>
                </div>
            </div>
            <div className="row">
                {
                    listings.map((values) => {
                        return (
                            <div className="col-6 card_product" key={values._id}>
                                <div className="row">
                                    <div className="col-6">
                                        <img src={`/uploads/${values.listingInfoObj.product.pimage}`} onClick={() => { singleProduct(values._id) }} alt={values.listingInfoObj.product.pname} className='img img-fluid product_img my-3 mx-1' />
                                    </div>
                                    <div className="col-6 my-5">
                                        <p className='cpname px-1'>{values.listingInfoObj.product.pname}</p>
                                        <div className='d-flex justify-content-between align-items-center py-2 px-1' style={{ borderBottom: "2px solid black" }}>
                                            <span className="pprice">₹ {values.listingInfoObj.product.pprice}.00</span>
                                            <span>{values.listingInfoObj.product.pcolor}</span>
                                        </div>
                                        <button className='addBtn w-100 mt-4' onClick={() => { addItem(values._id, values.listingInfoObj.product.pname, values.listingInfoObj.product.pprice, values.listingInfoObj.product.pcolor, values.listingInfoObj.product.pdescription, values.listingInfoObj.product.pimage) }}>Add To Cart</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Toaster />
        </div>
    )
}

export default SingleCategory;