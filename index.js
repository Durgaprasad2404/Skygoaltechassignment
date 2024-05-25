const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

//  from .env file
dotenv.config({ path: "./config.env" });

// Connect DB
require("./db/connection");

// Middleware to parseJSON
app.use(express.json());

// Middleware CORS mid
app.use(cors());

// Middleware parse-cookies
app.use(cookieParser());

// Middleware body parse-JSON
app.use(bodyParser.json());

// Routes
app.use(require("./router/auth"));

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
