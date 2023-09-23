const express = require("express");
const { requireSignIn } = require("../../../middleware/sellerAuth");
const { addNewListing, getListingsBySeller, updatelStatus, getListings, singleListing, singleCategory } = require("../../../controller/seller/listing/listing");
const routes = express.Router();
const multer = require("multer")
const ListIng = require("../../../model/seller/listing");


const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})

const isimage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new Error("Only Image Is Allowed"));
    }
}

const upload = multer({
    storage: imgconfig,
    fileFilter: isimage
})


routes.post("/addnewlisting", addNewListing);
routes.post("/productimage", upload.single("photo"), async (req, res) => {
    const imgpath = req.file.filename;
    const productId = req.body.productid;
    try {
        if (!imgpath || !productId) {
            res.status(422).json({
                status: 422,
                success: true,
                message: "All Fields Are Required"
            })
        } else {

            const isListing = await ListIng.findById(productId);
            if (isListing) {
                isListing.listingInfoObj.product.pimage = imgpath
                await isListing.save();
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "image add successfully"
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
})
routes.get("/getlistingsBySeller/:sid", getListingsBySeller)
routes.get("/updatelstatus/:lid", updatelStatus);
routes.get("/getlistings", getListings);
routes.get("/siglelisting/:id", singleListing);
routes.get("/siglecategory/:category", singleCategory);



module.exports = routes;