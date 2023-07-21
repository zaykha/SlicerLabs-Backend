// middleware.js
import express from "express";
import  admin  from "firebase-admin";
import calculatePrice from "./CalculatePrice.js";
import serviceAccount from "../secrets/slicerlabs-c10ea-firebase-adminsdk-b7iak-aec1952b84.mjs";
const MiddleWareapp = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://slicerlabs-c10ea-default-rtdb.asia-southeast1.firebasedatabase.app",
});

// middleware.js
const authenticateUser = (req, res, next) => {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.userId = decodedToken.uid;
      next();
    })
    .catch((error) => {
      console.error("Error verifying Firebase ID token:", error);
      return res.status(401).json({ message: "Invalid token" });
    });
};
// authenticateUser,
// Example of API endpoint to calculate mass and print time
MiddleWareapp.post("/calculate", authenticateUser, (req, res) => {
  const { material, color, dimensions } = req.body;

  // Validate the input values
  if (!material || !color || !dimensions) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate material
  const validMaterials = ["ABS", "PLA", "TPU", "NYLON", "PETG", "Resin"];
  if (!validMaterials.includes(material)) {
    return res.status(400).json({ error: "Invalid material" });
  }

  // Validate color
  const validColors = ["white", "black", "transparent"];
  if (!validColors.includes(color)) {
    return res.status(400).json({ error: "Invalid color" });
  }

  // Validate dimensions
  if (typeof dimensions !== "object" || Array.isArray(dimensions)) {
    return res.status(400).json({ error: "Invalid dimensions format" });
  }
  // Call the calculatePrice function to calculate the price
  const price = calculatePrice(material, color, dimensions);

  // Return the calculated price as the response
  res.json({ price });
});

MiddleWareapp.get("/calculate-function", authenticateUser, (req, res) => {
  // Return the entire calculatePrice function as part of the response
  res.json({ 
    calculatePrice: calculatePrice.toString() ,
  });
});

MiddleWareapp.post("/validate-price", authenticateUser, (req, res) => {
  const { material, color, dimensions, expectedPrice } = req.body;

  // Call the calculatePrice function to calculate the actual price
  const actualPrice = calculatePrice(material, color, dimensions);

  // Compare the actual price with the expected price from the client-side
  if (actualPrice === expectedPrice) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// Export the express app
export default MiddleWareapp;
