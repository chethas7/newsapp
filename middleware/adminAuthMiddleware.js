// middleware/adminAuthMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user || !user.isAdmin) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Admin access required" });
  }
};

module.exports = adminAuthMiddleware;
