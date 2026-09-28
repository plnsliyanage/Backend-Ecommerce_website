import express from "express";

import {
    createOrder,
    getOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/", createOrder);

// Get orders
orderRouter.get("/", getOrders);

// Update order status
orderRouter.put("/status/:orderID", updateOrderStatus);

export default orderRouter;