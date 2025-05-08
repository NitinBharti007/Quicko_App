import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.route.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";
import { webhookController } from "./controllers/order.controller.js";
import adminRouter from "./route/admin.route.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io accessible to our routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join admin room if user is admin
  socket.on('joinAdminRoom', () => {
    socket.join('admin');
    console.log('User joined admin room:', socket.id);
    // Acknowledge the join
    socket.emit('roomJoined', { room: 'admin' });
  });

  // Join user room
  socket.on('joinUserRoom', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room:`, socket.id);
      // Acknowledge the join
      socket.emit('roomJoined', { room: `user_${userId}` });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subCategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// Stripe webhook route needs raw body
app.post("/api/order/webhook", express.raw({type: 'application/json'}), webhookController);

// Parse JSON for all other routes
app.use(express.json());

// MongoDB connection
connectDB();
// Start server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is running`);
});