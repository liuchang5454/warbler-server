require("dotenv").config();// load SECRET_KEY from .ENV as process.env.SECRET_KEY
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
//all my routes here - they will come later


app.use(function(req, res, next){
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, function(){
  console.log(`Server is running on port ${PORT}`);
});