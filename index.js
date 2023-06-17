import express from 'express';
import  MiddleWareapp  from './src/MiddleWare.js';
const app = express();
const port = 3000; // Choose the port you want to run your server on
// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


app.use(express.json()); // To parse JSON request bodies
app.use(MiddleWareapp);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
