require("dotenv").config();
const express = require ("express");
const { connectDB } = require("./src/config/db");
const cors = require("cors");
const { connectCloudinary } = require("./src/config/cloudinary");
const mainRouter = require("./src/api/routes/main");

const app = express();
const PORT = 3000;

const allowedOrigins = [
  'https://p10-frontend.vercel.app', // versión deployada
  'http://localhost:3000', //Localhost para desarrollo
];

connectDB();
connectCloudinary();

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'El CORS no está permitido para este origen';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

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

