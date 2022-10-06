const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");

//middlewares
app.use(express.json());
app.use(cors());

//routes
const productRoute = require("./Routes/product.route");

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

// posting to database
app.use("/api/v1/product", productRoute);

module.exports = app;
