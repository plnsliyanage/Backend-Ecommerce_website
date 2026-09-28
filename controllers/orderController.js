import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
    try {
        // Get logged-in user from authentication middleware
        const user = req.user;

        // Check whether user is logged in
        if (user == null) {
            res.status(401).json({
                message: "Unauthorized user"
            });
            return;
        }

        // Get the latest order
        const orderList = await Order.find()
            .sort({ date: -1 })
            .limit(1);

        // Default first order ID
        let newOrderID = "CBC0000001";

        // Generate next order ID
        if (orderList.length != 0) {
            const lastOrderIDInString = orderList[0].orderID;

            // Remove CBC
            const lastOrderNumberInString =
                lastOrderIDInString.replace("CBC", "");

            // Convert number string to number
            const lastOrderNumber =
                parseInt(lastOrderNumberInString);

            // Increase order number
            const newOrderNumber =
                lastOrderNumber + 1;

            // Add leading zeros
            const newOrderNumberInString =
                newOrderNumber.toString().padStart(7, "0");

            // Create new order ID
            newOrderID = "CBC" + newOrderNumberInString;
        }

        // Get customer name
        let customerName = req.body.customerName;

        // If customer did not enter a name,
        // use the logged-in user's name
        if (customerName == null || customerName == "") {
            customerName =
                user.firstName + " " + user.lastName;
        }

        // Get phone number
        let phone = req.body.phone;

        // Use default value if phone is not provided
        if (phone == null) {
            phone = "Not provided";
        }

        // Get items sent from frontend
        const itemsInRequest = req.body.items;

        // Check whether items exist
        if (itemsInRequest == null) {
            res.status(400).json({
                message: "Items are required to place an order"
            });
            return;
        }

        // Items must be an array
        if (!Array.isArray(itemsInRequest)) {
            res.status(400).json({
                message: "Items should be an array"
            });
            return;
        }

        // Array for storing final order items
        const itemsToBeAdded = [];

        // Order total
        let total = 0;

        // Process every item
        for (let i = 0; i < itemsInRequest.length; i++) {
            const item = itemsInRequest[i];

            // Check whether colour was provided
            if (item.colour == null || item.colour == "") {
                res.status(400).json({
                    code: "colour-required",
                    message:
                        `Colour is required for product ${item.productID}`,
                    productID: item.productID
                });
                return;
            }

            // Find product using product ID
            const product = await Product.findOne({
                productID: item.productID
            });

            // Check product exists
            if (product == null) {
                res.status(400).json({
                    code: "not-found",
                    message:
                        `Product with ID ${item.productID} not found`,
                    productID: item.productID
                });
                return;
            }

            // Check stock
            if (product.stock < item.quantity) {
                res.status(400).json({
                    code: "stock",
                    message:
                        `Insufficient stock for product with ID ${item.productID}`,
                    productID: item.productID,
                    availableStock: product.stock
                });
                return;
            }

            // Add product to order
            itemsToBeAdded.push({
                productID: product.productID,
                quantity: item.quantity,

                // Save selected colour
                colour: item.colour,

                name: product.name,
                price: product.price,
                image: product.images[0]
            });

            // Calculate total
            total += product.price * item.quantity;
        }

        // Create new order
        const newOrder = new Order({
            orderID: newOrderID,
            items: itemsToBeAdded,
            customerName: customerName,
            email: user.email,
            phone: phone,
            address: req.body.address,
            total: total
        });

        // Save order to MongoDB
        const savedOrder = await newOrder.save();

        // Send success response
        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}


// Get orders
export async function getOrders(req, res) {

    // Admin can see all orders
    if (isAdmin(req)) {

        const orders = await Order.find()
            .sort({ date: -1 });

        res.json(orders);

    }

    // Customer can see their own orders
    else if (isCustomer(req)) {

        const user = req.user;

        const orders = await Order.find({
            email: user.email
        }).sort({ date: -1 });

        res.json(orders);

    }

    // Other users are not authorized
    else {

        res.status(403).json({
            message: "You are not authorized to view orders"
        });
    }
}


// Update order status
export async function updateOrderStatus(req, res) {

    // Only admin can update order status
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to update order status"
        });

        return;
    }

    const orderID = req.params.orderID;
    const newStatus = req.body.status;

    try {

        // Update status
        await Order.updateOne(
            { orderID: orderID },
            { status: newStatus }
        );

        res.json({
            message: "Order status updated successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to update order status"
        });

        return;
    }
}