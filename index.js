import express from "express";
import MiddleWareapp from "./src/MiddleWare.js";
import cors from "cors";

const app = express();
const port = 3000; // Choose the port you want to run your server on
// Enable CORS
const allowedOrigins = [
  "https://main--slicerlabs.netlify.app",
  "https://slicerlabs.netlify.app",
  "https://checkout.stripe.com",
  "http://192.168.1.5:5173",
  "http://127.0.0.1:5173"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // exposedHeaders: ['Authorization'], // Expose the Authorization header
  })
);

app.use(express.json()); // To parse JSON request bodies
app.use(MiddleWareapp);

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
