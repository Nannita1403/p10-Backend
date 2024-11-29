require("dotenv").config();
const express = require ("express");
const { connectDB } = require("./src/config/db");
const cors = require("cors");
const { connectCloudinary } = require("./src/config/cloudinary");
const userRouter = require("./src/api/routes/user");
const eventRouter = require("./src/api/routes/events");
const artistRouter = require("./src/api/routes/artists");
const mainRouter = require("./src/api/routes/main");

const app = express();
const PORT = 3000;

connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());    

app.use('/api/v1', mainRouter);

app.use("*", (req,res,next)=> {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
  });

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
  });

app.listen(PORT, ()=> {
    console.log('http://localhost:'+ PORT);
});

