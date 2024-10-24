require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", JSON.stringify(err, null, 2));
    process.exit(1);
  });

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/todos", todoRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
