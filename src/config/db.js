const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/myauthclass";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
