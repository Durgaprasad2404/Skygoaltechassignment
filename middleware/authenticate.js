const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
  try {
    // JWT token from reqst
    let jtoken = req.header("Authorization").split(" ");
    let token = jtoken[1];
    // console.log(token);
    // Verify JWT token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    // unauthorized access
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};

module.exports = Authenticate;
