const jwt = require("jsonwebtoken");
const requireLogin = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {
            email: decodedToken.email,
            _id: decodedToken._id
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};

module.exports = {
    requireLogin
}