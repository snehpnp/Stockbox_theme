require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {connectToMongoDB} = require("./App/config/db");
const themeRoutes = require("./App/Routes/themeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// connectToMongoDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", themeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();
});
