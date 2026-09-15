const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const speciesRouter = require("./routes/species");
app.use("/api/species", speciesRouter);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "client", "dist"))
  );

  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/api/")
    ) {
      return res.sendFile(
        path.join(__dirname, "client", "dist", "index.html")
      );
    }

    next();
  });
}

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });