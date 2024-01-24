// middleware.js
import express from "express";
import admin from "firebase-admin";
import calculatePrice from "./CalculatePrice.js";
import stripe from "./stripconfig.js";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import { promises as fsPromises } from 'fs';
// import {firebaseAdminSDK} from "../secrets/slicerlabs-c10ea-firebase-adminsdk-b7iak-aec1952b84.mjs";
const MiddleWareapp = express();

const corsHeader = {
  "Access-Control-Allow-origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
// const auth = getAuth();
// const firebaseAdminSdkCredentials = JSON.parse(
//   process.env.FIREBASE_ADMIN_SDK_CREDENTIALS
// );

// console.log(firebaseAdminSdkCredentials)
admin.initializeApp({
  // credential: admin.credential.cert(firebaseAdminSdkCredentials),
   credential: admin.credential.cert({
    type: "service_account",
    project_id: "slicerlabs-c10ea",
    private_key_id: "aec1952b84a8d57638f5de1adc3e90a169493251",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrc5pTRgfPa+u6\n9yJCwurfl7YAfQ0CdJQbpu+qzVsOKQouWkZ3bKR8Nzo1K5gQmgX3Axk/QE+NKpL8\nAX7IkCmmDP/S74pT0p8LyDAChwXYHH5JV7vCcmne4Yly9q1ZbYapTz9A8HwL+rrh\nVjE2yeJlbzsAAJ21PxL1R0zNSo7cS/EWxuESw5ZPTmNY0F8b9lM5lCaSA2uMpm7q\nJUQwklgYigSuSEIMT1pQw43EwotdLTvS9B2ffNT617B/NCSUrcgBOSZQxGSQZhDi\nGqxZkR1khBSWwxvOOqbvRNMhJT4MWyxIary09B3IaAcbTOzMpOb4pgGXx7cPHh0E\nX76x21L9AgMBAAECggEAKDxU9z30D0VwaMweijRcEmT0HWE7cFwTdfnTPO48dDJF\nZWNiLhyc7Vm4m0nDwgGjbLiZcDKTeLmJDQL80eyjGYjrcIEuoUVIdedg/Pba9ECb\nknK4aYWYOuoK66PgQqBlfc5PNdo6AkWxHbiwi/8M1mkoG3QJjsNim5VD/NmGdUQq\nyjYgfGm7GKJrvXHOImegntvlxMI1FypAIVSGqEsPBxdcZjv47rhYFt5B2EzaQHQk\n+i0M/BgQQfpn/3sV7CePaVcLBHGhsXN+KGYxZgoyQdcQlOnUiTSkgI6YegSWDcBd\nT7G/SU3+w6svGo7fAROHE96GQlKO6hy+ZWA7P0ZfMQKBgQDYQdbj/mdO3oew8kQt\npoooH1Yz6cOZnj5GGjgMmsdzYpEMhUCI1f6UA/49jaVlBoii+PRuOFhRFyKJxRGu\nQbOCZ21myuMG8WdTXdoZ8sDJbsqoHUcENtNeBuw0XTtwS0aHmc4sWoyNxNqTD6ST\n1d5+7CgLa7KSms4xHh1JLsFlNwKBgQDK9dANSGOcbH1i1vm5aVecg24CF8VqT1u4\nf6/UojblvYXcb7tewHKd9y0qjhbIPTxxMqZIQGAqPSWSbA0zKFd9tnN1B00OeQZW\nQLv7MdKnQDSObkJX22228b+8QAAsZFxunj+inKFaUp38TkVzQ5DwrlI/7cAIWK/r\n3TpCYwyjawKBgHvHG3890tWiqxnNYNacNwGGBioKh8k6eLxZL3GPec+CQDFhZ7Gq\ngl8n9fI3S86KMdTOF+GqYGpxinQ+lsMdmehu2IB4af9EVvaxhi9J8ayZvGcC8u3n\nj42G+tVx855vh3v/vbFHVqGiZdS8pF91jzcoZjc7OmeNMa2NZgfIOit7AoGBALPy\ngcZlGjxETF9n7v2fEpioRs8AOH5rYg0Q2NqUAExtXtP1FJGL25OG5brHRBfBg2dx\n2tBQk3KfyEIsHv/ukrPZIkDuejmMwDuVJZYvtG+pk298/sFawcnkSXUk4YJ6cSF6\nmT0Z1k141q4uz5DEpStfw3j+2LYNu9xJxy+5FimFAoGANTiR7wBkCfx7VqJtWqGJ\njb0mSPgVH3kHmVUL/e8x5mVHuyly9koZfV2mGx/8aEibn0wSysX5usA6GIr7MrKT\nzut1CqebzwWfMqDZSeWIkyVB4gzEF1CddmId53fSSwy4HJ3g6w1klOF3he+/dAeg\nKdpQIeH4//oCHVIL/DA4OTI=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-b7iak@slicerlabs-c10ea.iam.gserviceaccount.com",
    client_id: "114841800848696886048",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b7iak%40slicerlabs-c10ea.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
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
//not Active
const isValidPromoCode = (promoCode) => {

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

MiddleWareapp.get("/calculate-function", (req, res) => {
  // Return the entire calculatePrice function as part of the response
  res.json({
    calculatePrice: calculatePrice.toString(),
  });
});

MiddleWareapp.post("/validate-price", (req, res) => {
  const items = req.body;
  // console.log(items)
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  // fetchConfigSettings(items[0].itemId)
  let isValid = true;
  items.forEach((item) => {
    const { material, color, dimensions, quantity, price, materialSettings } =
      item;
    const actualPrice = calculatePrice(
      material,
      color,
      dimensions,
      materialSettings
    );
    const totalPrice = actualPrice * quantity;
    // console.log(actualPrice, totalPrice, price, quantity);
    if (totalPrice !== price * quantity) {
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
    // If the promo code is valid, can calculate the discounted amount and return it as the response
    // For example, if the order total is $100, and the discountPercentage is 10 (10%),
    // then the discounted amount will be $100 * 0.1 = $10, and the final amount will be $100 - $10 = $90.

    // Apply calculation logic here and return the discounted amount
    const orderTotal = 100; // Replace this with the actual order total
    const discountedAmount = orderTotal * (discountPercentage / 100);
    const finalAmount = orderTotal - discountedAmount;

    res.json({ finalAmount, discountPercentage });
  } else {
    res.status(400).json({ error: "Invalid promo code" });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zaykha@gmail.com',
    pass: process.env.GMAIL_APP_KEY,
  },
});

MiddleWareapp.post('/send-email', async(req, res, next) => {
  const { to, subject } = req.body;
  // Read the HTML template file
  const data = await fsPromises.readFile('purchase_confirmation_template.html', 'utf8');
  try {
    // Read the HTML template file using fs.promises.readFile
    const data = await fsPromises.readFile('purchase_confirmation_template.html', 'utf8');

    // Create the mail options with the HTML template
    const mailOptions = {
      from: 'SlicerLabs Team',
      to,
      subject,
      html: data, // Use the contents of the template file as the email body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        next(); // Proceed to the next middleware or route
      }
    });
  } catch (err) {
    console.error('Error reading template file:', err);
    return res.status(500).json({ error: 'Error reading email template' });
  }
  });

MiddleWareapp.post(
  "/create-checkout-session",
  // authenticateUser,
  async (req, res) => {
    const items = req.body;

    const userUID = items[0].userUID;
    console.log(items, userUID);
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
        success_url: `https://slicerlabs.netlify.app/success?user_id=${userUID}`,
        cancel_url: `https://slicerlabs.netlify.app/cart?returning_user_id=${userUID}`,
      });
      // res.redirect(session.url)
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
  const apiUrl = `https://api.ValidEmail.net/?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log("Error validating email:", error);
    res.status(500).json({ error: "Error validating email" });
  }
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// middleware.js
MiddleWareapp.get("/get-stripe-key", (req, res) => {
  res.json({ publishableKey: stripeSecretKey });
});

// Export the express app
export default MiddleWareapp;
