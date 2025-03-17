const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const logger = require("../utils/logger");
const config = require("../utils/config");

const auth = async (req, res, next) => {
    try {
        // Get Auth header and check if it exists
        const authHeader = req.headers.Authorization || req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ status: "error", message: "No token provided" });
        };

        // validate token and token scheme
        // Bearer {accessToken}
        const [scheme, token] = authHeader.split(" ");

        if (scheme.toLowerCase() !== "bearer" || !token) {
            return res.status(401).json({ status: "error", message: "Invalid token provided" });
        };

        // decode the json web token(jwt)
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // use the decoded payload to find the user on the db
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid token provided" });
        };

        // populate the req.user property of the request object
        req.user = user;

        // call next 
        next();
    } catch (error) {
        logger.error(error.message);
        res.status(401).json({ status: "success", message: "Invalid token provided" })
    }
};

module.exports = auth;