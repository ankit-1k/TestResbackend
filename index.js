const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./srcnode/db/db");
const authRouter=require('./srcnode/router/routerAuth')
const reservationRoutes=require('./srcnode/router/router')
const app = express();
app.use(
    cors(
    //     {
    //   origin: "http://localhost:3000",
    //   credentials: true,
    // }
)
  );
app.use(bodyParser.json());

connectDB();
app.use(express.json());
app.use(reservationRoutes);
app.use('/api/auth', authRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});