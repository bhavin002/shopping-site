const seller = require("../../../model/seller/seller");
const ListIng = require("../../../model/seller/listing");

const addNewListing = async (req, res) => {
    try {
        const { sellerid, listinginfo } = req.body;
        const regEx = /[-+]?[0-9]*\.?[0-9]+/;
        const { listing, inventory, delivery, product } = listinginfo;
        if (!listing.lstatus) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Enter Valid Listing Status Details"
            })
        } else if (!inventory.stock || !regEx.test(inventory.stock)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Enter Valid Inventory Details"
            })
        } else if (!delivery.dcharge || !regEx.test(delivery.dcharge)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Enter Valid Delivery Details"
            })
        } else if (!product.pname || !product.pprice || !product.pcategory || !product.pbrand || !product.pcolor || !product.pdescription || !regEx.test(product.pprice)) {
            res.status(422).json({
                status: 422,
                success: false,
                message: "Enter Valid Product Details"
            })
        } else {
            const newListing = await new ListIng({
                sellerId: sellerid,
                listingInfoObj: listinginfo
            }).save()

            if (newListing) {
                res.status(201).json({
                    status: 201,
                    success: true,
                    message: "Listing Create Successfully",
                    data: newListing
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - addNewListing"
        })
    }
}

const getListingsBySeller = async (req, res) => {
    try {
        const sellerId = req.params['sid'];
        const listings = await ListIng.find({ sellerId: sellerId })
        if (listings) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Listings Found",
                data: listings
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getListingsBySeller"
        })
    }
}

const updatelStatus = async (req, res) => {
    try {
        const lId = req.params['lid'];
        const isListing = await ListIng.findById(lId);
        if (isListing) {
            if (isListing.listingInfoObj.listing.lstatus === "inactive") {
                isListing.listingInfoObj.listing = {
                    lstatus: "active"
                }
            } else {
                isListing.listingInfoObj.listing = {
                    lstatus: "inactive"
                }
            }
            const updateLStatus = await isListing.save();
            if (updateLStatus) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Listing Status Updated Successfully"
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - updatelStatus"
        })
    }
}

const getListings = async (req, res) => {
    try {
        const allListing = await ListIng.find({});
        const activeListings = allListing.filter((values) => {
            return values.listingInfoObj.listing.lstatus === "active"
        })
        if (activeListings) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Get All Listings",
                data: activeListings
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - getListings"
        })
    }
}

const singleListing = async (req, res) => {
    try {
        const lId = req.params['id'];
        const oneListing = await ListIng.findById(lId)
        if (oneListing) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Get One Listing",
                data: oneListing
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - singleListing"
        })
    }
}

const singleCategory = async (req, res) => {
    try {
        const category = req.params['category'];
        const allListing = await ListIng.find({});
        const oneCategory = allListing.filter((values) => {
            return values.listingInfoObj.product.pcategory === category
        })
        const activeListing = oneCategory.filter((values) => {
            return values.listingInfoObj.listing.lstatus === "active"
        })
        if (activeListing) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Listings By Category",
                data: activeListing
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error - singleListing"
        })
    }
}

module.exports = {
    addNewListing,
    getListingsBySeller,
    updatelStatus,
    getListings,
    singleListing,
    singleCategory,
}