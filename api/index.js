import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import projectRouter from './routes/project.route.js'
import commuintyRouter from './routes/community.route.js'
import blogsRouter from './routes/blogs.route.js'
import pageRouter from './routes/page.route.js'
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; 

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" })); // You can increase the limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {});
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application if the connection fails
  }
};

// Call the function to connect to the database
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/project", projectRouter);
app.use("/api/community", commuintyRouter);
app.use("/api/blog", blogsRouter);
app.use("/api",pageRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
