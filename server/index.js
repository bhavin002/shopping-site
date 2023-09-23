const express = require("express")
const app = express();
const dotEnv = require("dotenv");
const userRoutes = require("./route/user/user");
const sellerRoutes = require("./route/seller/seller");
const listingRoutes = require("./route/seller/listing/listing");
const cartRoutes = require("./route/user/cart/cart")
const conn = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser")

// connection
conn("bhavin", "bhavin");

// dotEnv Config
dotEnv.config();

// required 
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/uploads", express.static("./uploads"));

// routes
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/seller/listing", listingRoutes)
app.use("/api/user/cart", cartRoutes)
// running server 
const PORT = process.env.PORT_NO;
app.listen(PORT, () => {
    console.log(`Server Is Running on Port ${PORT}`);
})
