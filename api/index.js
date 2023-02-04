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

app.use(cors({
  origin: '*', // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

app.use(morgan('dev'));
app.use(express.json())


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
}) 

app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)

})

 