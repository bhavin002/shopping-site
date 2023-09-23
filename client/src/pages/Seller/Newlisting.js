import React, { useEffect, useState } from 'react'
import Sellermenu from '../../component/Layout/Sellermenu';
import axios from 'axios';
import { useSeller } from '../../context/seller';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Newlisting = () => {
    const { seller } = useSeller();
    const navigate = useNavigate();
    const [productId, setProductId] = useState(null);

    const [listingInfo, setListingInfo] = useState({
        listing: {
            lstatus: ''
        },
        inventory: {
            stock: '',
        },
        delivery: {
            dcharge: ''
        },
        product: {
            pname: '',
            pprice: '',
            pcategory: '',
            pbrand: '',
            pcolor: '',
            pdescription: ''
        }
    })

    const handleChangeListing = (e) => {
        const { name, value } = e.target;
        const [group, field] = name.split('.');
        setListingInfo({
            ...listingInfo,
            [group]: {
                ...listingInfo[group],
                [field]: value
            }
        })
    }

    const { listing, inventory, delivery, product } = listingInfo;
    const { lstatus } = listing;
    const { stock } = inventory;
    const { dcharge } = delivery;
    const { pname, pprice, pcategory, pbrand, pcolor, pdescription } = product;
    const [productImage, setProductImage] = useState(null);
    const [isImage, setIsImage] = useState(false);

    let formReadToSave = lstatus && stock && dcharge && pname && pprice && pcategory && pbrand && pcolor && pdescription && productImage;

    const regEx = /[-+]?[0-9]*\.?[0-9]+/;

    const saveProduct = async (e) => {
        e.preventDefault();
        if (!regEx.test(inventory.stock)) {
            toast.error("Enter Valid Inventory Details")
        } else if (!regEx.test(delivery.dcharge)) {
            toast.error("Enter Valid Delivery Charge Details")
        } else if (!regEx.test(product.pprice)) {
            toast.error("Enter Valid Product Price Details")
        } else {
            const sellerId = seller?.seller._id;
            try {
                const res = await axios.post(`http://localhost:8081/api/seller/listing/addnewlisting`, {
                    sellerid: sellerId,
                    listinginfo: listingInfo
                })
                if (res.data.status === 201) {
                    console.log(res.data.data._id);
                    setProductId(res.data.data._id);
                    setIsImage(true);
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    const imgUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("photo", productImage);
            formData.append("productid", productId)
            const config = {
                headers: {
                    "Authorization": seller.token,
                    'Content-Type': 'multipart-formdata'
                }
            }
            const res = await axios.post('http://localhost:8081/api/seller/listing/productimage', formData, config);
            if (res.data.status === 200) {
                navigate("/sellerdash/seller/listings")
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        if (isImage === true) {
            imgUpload();
        }
        // eslint-disable-next-line
    }, [isImage, setIsImage])


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <Sellermenu />
                </div>
                <div className="col-md-9">
                    <div>
                        <div className='heading'>
                            <p>Add New Listing</p>
                        </div>
                        <div className="d-flex justify-content-end py-3 px-5 boxHeadings" style={{ boxShadow: "rgb(246, 242, 242) 0px 2px 8px 0px" }}>
                            <p className="lead">Listing Information</p>
                        </div>
                        <div className="listingBox">
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Status Details</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="listing.lstatus" className='title'>Listing Status*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <select className="form-select" onChange={handleChangeListing} value={listingInfo.listing.lstatus} name="listing.lstatus" id="listing.lstatus">
                                            <option value="default">Select One</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Inventory Details</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="inventory.stock" className='title'>Stock*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input type="text" className='form-control' onChange={handleChangeListing} value={listingInfo.inventory.stock} name="inventory.stock" id="inventory.stock" />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Delivery Charge To Customer</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="delivery.dcharge" className='title'>Delivery charge*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input type="text" className='form-control' onChange={handleChangeListing} value={listingInfo.delivery.dcharge} name="delivery.dcharge" id="delivery.dcharge" placeholder='INR' />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Name Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="pname" className='title'>Product Name*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input type="text" className='form-control' onChange={handleChangeListing} value={listingInfo.product.pname} name='product.pname' id='pname' />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Price Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="pprice" className='title'>Product Price*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input type="text" className='form-control' onChange={handleChangeListing} value={listingInfo.product.pprice} name='product.pprice' id='pprice' />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Image Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="pimage" className='title'>Product Image*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input className="form-control" type="file" id="pimage" onChange={(e) => setProductImage(e.target.files[0])} />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Category Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="pcategory" className='title'>Product Category*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <select className="form-select" onChange={handleChangeListing} value={listingInfo.product.pcategory} name='product.pcategory' id='pcategory'>
                                            <option value="default">Select One</option>
                                            <option value="airdopes">Airdopes</option>
                                            <option value="earphone">Earphone</option>
                                            <option value="headphone">Headphone</option>
                                            <option value="speaker">Speaker</option>
                                            <option value="watch">Watch</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Brand Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="pbrand" className='title'>Product Brand*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input type="text" className='form-control' onChange={handleChangeListing} value={listingInfo.product.pbrand} name='product.pbrand' id='pbrand' />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Color Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5">
                                    <div className="col-3">
                                        <label htmlFor="pcolor" className='title'>Product Color*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <input type="text" className='form-control' onChange={handleChangeListing} value={listingInfo.product.pcolor} name='product.pcolor' id='pcolor' />
                                    </div>
                                </div>
                            </div>
                            <div className='border border-bottom-1 mb-2'>
                                <div className="row mx-2 my-3">
                                    <div className="col-12">
                                        <span className='lead'>Description Of Product</span>
                                    </div>
                                </div>
                                <div className="row px-5 pb-2">
                                    <div className="col-3">
                                        <label htmlFor="pdescription" className='title'>Product Description*</label>
                                    </div>
                                    <div className="col-1">
                                        <p className="title mt-2">:</p>
                                    </div>
                                    <div className="col-8 mt-1">
                                        <div className="form-group">
                                            <textarea className="form-control rounded-0" onChange={handleChangeListing} value={listingInfo.product.pdescription} id="pdescription" name='product.pdescription' rows="3"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between px-5 py-3 boxHeadings" style={{ boxShadow: "rgb(246, 242, 242) 0px 2px 8px 0px" }}>
                            <div><p className="lead">* Mandatory Fields</p></div>
                            <div><button className='btn btn-primary px-5' onClick={saveProduct} disabled={!formReadToSave}>Save</button></div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Newlisting;