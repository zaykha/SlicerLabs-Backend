// middleware.js
import express from "express";
import admin from "firebase-admin";
import calculatePrice from "./CalculatePrice.js";
import serviceAccount from "../secrets/slicerlabs-c10ea-firebase-adminsdk-b7iak-aec1952b84.mjs";
import stripe from "./stripconfig.js";
import fetch from "node-fetch";
import { getAuth, updateEmail } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseconfig.js";

const MiddleWareapp = express();

const corsHeader = {
  "Access-Control-Allow-origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
// const auth = getAuth();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://slicerlabs-c10ea-default-rtdb.asia-southeast1.firebasedatabase.app",
});

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

const isValidPromoCode = (promoCode) => {
  // Here, you can query your database or Firebase to check if the promo code exists and is valid.
  // You may also want to check if the promo code has not expired.

  // For example, assuming you have promo codes stored in an array or database:
  const validPromoCodes = [
    { code: "SUMMER2023", discountPercentage: 10, validUntil: "2023-08-31" },
    // Add more valid promo codes here
  ];

  // Find the promo code in the array of valid promo codes
  const validPromo = validPromoCodes.find(
    (promo) =>
      promo.code === promoCode && new Date() <= new Date(promo.validUntil)
  );

  if (validPromo) {
    return validPromo.discountPercentage; // Return the discount percentage if the code is valid
  }

  // Return false if the promo code is not valid
  return false;
};
async function getUserFromDatabase(userId) {
  try {
    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(collection(db, 'users'), userId));

    if (userDoc.exists()) {
      // Return user data from the document
      return userDoc.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user from database:', error);
    throw error;
  }
}
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
    calculatePrice: calculatePrice.toString(),
  });
});

MiddleWareapp.post("/validate-price", (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  let isValid = true;
  items.forEach((item) => {
    const { material, color, dimensions, quantity, price } = item;
    const actualPrice = calculatePrice(material, color, dimensions);
    const totalPrice = actualPrice * quantity;
    console.log(totalPrice, price, quantity);
    if (totalPrice !== price*quantity) {
      isValid = false;
    }
  });
  
  if (isValid) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

MiddleWareapp.post("/calculate-shipping", authenticateUser, (req, res) => {
  const { shippingOption, distance } = req.body;

  // Validate the input value
  if (!shippingOption) {
    return res.status(400).json({ error: "Missing required field" });
  }

  // Implement your shipping cost calculation logic based on the selected shipping option
  let shippingCost = 0;
  if (shippingOption === "NML") {
    shippingCost = 10; // Example shipping cost for ABS express shipping
  } else if (shippingOption === "EXP") {
    shippingCost = 5; // Example shipping cost for PLA normal shipping
  } else {
    return res.status(400).json({ error: "Invalid shipping option" });
  }

  // Return the calculated shipping cost as the response
  res.json({ shippingCost });
});

MiddleWareapp.post("/apply-promo", authenticateUser, (req, res) => {
  const { promoCode } = req.body;

  // Validate the input value
  if (!promoCode) {
    return res.status(400).json({ error: "Missing required field" });
  }

  // Implement your promo code handling logic here
  // You can check if the promo code is valid and calculate the discount accordingly

  // For example, let's assume promo code "SUMMER10" gives a 10% discount
  if (promoCode === "SUMMER10") {
    // Get the total items cost from the request body
    const { totalItemsCost } = req.body;

    // Calculate the discount amount
    const discountAmount = (10 / 100) * totalItemsCost;

    // Return the discount amount as the response
    return res.json({ discountAmount });
  }

  // If the promo code is invalid, return an error response
  return res.status(400).json({ error: "Invalid promo code" });
});

MiddleWareapp.post("/apply-promo-code", authenticateUser, (req, res) => {
  const { promoCode } = req.body;

  // Validate the input value
  if (!promoCode) {
    return res.status(400).json({ error: "Missing promo code" });
  }

  // Validate the promo code using the isValidPromoCode function
  const discountPercentage = isValidPromoCode(promoCode);

  if (discountPercentage !== false) {
    // If the promo code is valid, you can calculate the discounted amount and return it as the response
    // For example, if the order total is $100, and the discountPercentage is 10 (10%),
    // then the discounted amount will be $100 * 0.1 = $10, and the final amount will be $100 - $10 = $90.

    // Apply your calculation logic here and return the discounted amount
    const orderTotal = 100; // Replace this with the actual order total
    const discountedAmount = orderTotal * (discountPercentage / 100);
    const finalAmount = orderTotal - discountedAmount;

    res.json({ finalAmount, discountPercentage });
  } else {
    res.status(400).json({ error: "Invalid promo code" });
  }
});

MiddleWareapp.post(
  "/create-checkout-session",
  // authenticateUser,
  async (req, res) => {
    const items = req.body;
    
    const userUID = items[0].userUID;
    console.log(items,userUID);
    // Create a line_items array for the Stripe checkout session
    const lineItems = items.map((item) => {
      const { material, color, dimensions, price, itemId, quantity } = item;
      return {
        price_data: {
          currency: "sgd",
          unit_amount: Math.round(price * 100), // Convert price to cents
          product_data: {
            // productId: itemId,
            name: itemId,
            description: color,
            metadata: {
              material,
              dimensions: JSON.stringify(dimensions),
            },
            images: [], // You can include image URLs if you have them
          },
        },
        quantity: quantity,
      };
    });

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `http://127.0.0.1:5173/success?user_id=${userUID}`,
        cancel_url: `http://127.0.0.1:5173/cart?returning_user_id=${userUID}`,
      });

      res.status(200).json({ url: session.url });

      // return res.json(session);
    } catch (error) {
      // Handle any error that occurred during the creation of the checkout session
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  }
);
MiddleWareapp.get("/validate-email", async (req, res) => {
  const { email } = req.query;
 
  const token = "80fbc8ce7e0f482d9f5f36e50cb11389";
  const apiUrl = `https://api.ValidEmail.net/?email=${encodeURIComponent(email)}&token=${token}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log("Error validating email:", error);
    res.status(500).json({ error: "Error validating email" });
  }
});

// Route to update user email
MiddleWareapp.post('/update-email', async (req, res) => {
  const { userId, newEmail } = req.body;

  try {
   
      // Fetch user data from your database (e.g., Firestore)
      const userData = await getUserFromDatabase(userId);
      console.log(userData);
      // Check if the new email is valid and verified
      if (userData.email === newEmail && userData.isEmailVerified) {
        // Update the user's email in Firebase Auth
        await updateEmail(user, newEmail);

        res.status(200).json({ message: 'Email updated successfully' });
      } else {
        res.status(400).json({ error: 'Invalid email or email not verified' });
      }
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'An error occurred while updating email' });
  }
});
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// middleware.js
MiddleWareapp.get("/get-stripe-key", (req, res) => {
  res.json({ publishableKey: stripeSecretKey });
});

// Export the express app
export default MiddleWareapp;
