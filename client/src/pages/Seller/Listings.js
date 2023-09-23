import React, { useEffect, useState } from 'react'
import Sellermenu from '../../component/Layout/Sellermenu';
import axios from 'axios';
import { useSeller } from '../../context/seller';
import { toast, Toaster } from "react-hot-toast";
const Listings = () => {

    const { seller } = useSeller();
    const [listings, setListings] = useState([]);
    const [isListing, setIsListing] = useState(false);

    const getListings = async () => {
        const sellerId = seller?.seller._id;
        try {
            const res = await axios.get(`http://localhost:8081/api/seller/listing/getlistingsBySeller/${sellerId}`)
            if (res.data.status === 200) {
                if (res.data.data.length > 0) {
                    setListings(res.data.data)
                    setIsListing(true);
                }
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }



    useEffect(() => {
        getListings();
        // eslint-disable-next-line
    }, [])

    const lstatusBtn = async (lid) => {
        console.log(lid);
        try {
            const res = await axios.get(`http://localhost:8081/api/seller/listing/updatelstatus/${lid}`);
            if (res.data.status === 200) {
                getListings();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }

    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <Sellermenu />
                </div>
                <div className="col-md-9">
                    <div className='heading'>
                        <p>Your Listed Products</p>
                    </div>
                    {
                        isListing && <table className='table table-bordered table-striped'>
                            <thead className='text-center'>
                                <tr>
                                    <th>Sr.no</th>
                                    <th>PName</th>
                                    <th>PPrice</th>
                                    <th>PCategory</th>
                                    <th>PBrand</th>
                                    <th>PColor</th>
                                    <th>PImage</th>
                                    <th>Stock</th>
                                    <th>Sell Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {
                                    listings.map((values, index) => {
                                        return (
                                            <tr key={values._id}>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{index + 1}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{values.listingInfoObj.product.pname}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>₹ {values.listingInfoObj.product.pprice}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{values.listingInfoObj.product.pcategory}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{values.listingInfoObj.product.pbrand}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{values.listingInfoObj.product.pcolor}</td>
                                                <td className='m-0 p-0' ><img src={`/uploads/${values.listingInfoObj.product.pimage}`} alt={values.listingInfoObj.product.pname} width="50px" height="50px" /></td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{values.listingInfoObj.inventory.stock}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"}>{values.listingInfoObj.inventory.sellItem}</td>
                                                <td className={values.listingInfoObj.listing.lstatus === "inactive" ? "text-danger" : "text-dark"} style={{ cursor: "pointer" }} onClick={() => { lstatusBtn(values._id) }}>{values.listingInfoObj.listing.lstatus}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Listings;