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
import emailRouter from './routes/email.route.js';
import agentsRouter from './routes/agents.routes.js';
import teamRouter from './routes/member.route.js';
import developerRoutes from "./routes/developer.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; 
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import https from "https";
import fs from "fs";
import path from "path";
dotenv.config();

const app = express();

// CORS Configuration
//const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim());
//const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === "true";
//const corsOptions = {
  //origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    //if (!origin) return callback(null, true);

    // Check if we want to allow all origins
    //if (allowAllOrigins) {
     // return callback(null, true); // Allow any origin
    //}

    // Restrict to the allowed origins in the env file
    //if (allowedOrigins.indexOf(origin) === -1) {
     // const msg = "The CORS policy for this site does not allow access from the specified Origin.";
    //  return callback(new Error(msg), false);
   // }
    
   // return callback(null, true);
  //},
  //credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  //optionsSuccessStatus: 200, // For legacy browsers
//};
const corsOptions = {
  origin: true, // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" })); // You can increase the limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
      styleSrc: ["'self'", "trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "trusted-cdn.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "trusted-cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
)

// Database Connection

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
app.use("/api/agents",agentsRouter);
app.use('/api/email', emailRouter);
app.use("/api/team", teamRouter);
app.use("/api/developers", developerRoutes);

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
const sslOptions = {
  key: fs.readFileSync(path.resolve('./cert/server.key')),
  cert: fs.readFileSync(path.resolve('./cert/server.cert')),
};
