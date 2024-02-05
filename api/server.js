require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000; // or any port of your choice

// Middleware
app.use(express.json());

// Define routes here (e.g., API endpoints for interacting with the database)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
