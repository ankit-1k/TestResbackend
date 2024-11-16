const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./srcnode/db/db");
const authRouter=require('./srcnode/router/routerAuth')
const reservationRoutes=require('./srcnode/router/router')
const orderRoutes = require('./srcnode/router/orderRouter');
const adminRouter = require('./srcnode/router/adminRouter');

const menuRoutes = require("./srcnode/adminRouter/adMenu");
const contactRouter = require("./srcnode/router/contactRouter");
const app = express();

const allowedOrigins = [
  "https://teston-lovat.vercel.app", // Frontend on Vercel
  "http://localhost:3000",           // Local development frontend
  "https://restaurantbackend-1b3r0ac66-ankits-projects-1030ff5d.vercel.app", // Example of allowed backend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // If you're sending cookies or authentication tokens
};


app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/admin', adminRouter);
connectDB();
app.use(express.json());
app.use(reservationRoutes);
app.use('/api/auth', authRouter);
app.use('/api', orderRoutes);
app.use("/api", menuRoutes);
app.use('/api',contactRouter)

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export the app for Vercel
