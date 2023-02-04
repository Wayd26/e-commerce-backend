const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const morgan = require("morgan")

const authRoutes = require("../routes/auth")
const categoryRoutes = require("../routes/category")
const productRoutes = require("../routes/product")


dotenv.config();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI).then(
    () => console.log("Database Connected Successfully")
).catch(error => console.log("Failed to connect to Database ", error))


app.use(morgan('dev'));
app.use(express.json())

app.use(function(req, res, next) {
  var oneof = false;
  if(req.headers.origin) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      oneof = true;
  }
  if(req.headers['access-control-request-method']) {
      res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
      oneof = true;
  }
  if(req.headers['access-control-request-headers']) {
      res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      oneof = true;
  }
  if(oneof) {
      res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method == 'OPTIONS') {
      res.send(200);
  }
  else {
      next();
  }
});

app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)

})

 