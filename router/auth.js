const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Authenticate = require("../middleware/authenticate");

// cookie parser middleware
router.use(cookieParser());

//  database connection
require("../db/connection");
const User = require("../model/userSchema");

// Register route
router.post("/api/signup", async (req, res) => {
  const { Username, email, password } = req.body;
  if (!Username || !email || !password) {
    return res.status(422).json({ error: "Please fill in all the fields" });
  }

  try {
    // checking user in r not
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ err: "Email already exists" });
    }

    const user = new User({ Username, email, password });
    const userdetails = await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Login route
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all the data" });
    }

    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate tkn
    const token = await userLogin.generateAuthToken();
    // console.log(`token:${token}`);
    // JWT token to cookie
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    // Send token in response
    res.json({ token, message: "User login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// User route (protected)
router.get("/api/user", Authenticate, (req, res) => {
  res.send(req.rootUser);
});
// Logout route
router.get("/api/logout", (req, res) => {
  try {
    res.clearCookie("jwtoken", { path: "/" });
    res.status(200).send("User logout");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
