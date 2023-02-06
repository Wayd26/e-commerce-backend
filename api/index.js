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
app.use(cors())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next()
})
app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)

})

