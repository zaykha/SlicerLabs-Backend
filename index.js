import express from 'express';
import  MiddleWareapp  from './src/MiddleWare.js';
import cors from 'cors';

const app = express();
const port = 3000; // Choose the port you want to run your server on
// Enable CORS
const allowedOrigins = ['http://127.0.0.1:5173', 'https://checkout.stripe.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: ['Authorization'], // Expose the Authorization header
}));


app.use(express.json()); // To parse JSON request bodies
app.use(MiddleWareapp);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
