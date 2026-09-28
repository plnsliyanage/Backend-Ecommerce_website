import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // Unique order ID
        orderID: {
            type: String,
            required: true,
            unique: true
        },

        // Products included in the order
        items: {
            type: [
                {
                    // Product ID
                    productID: {
                        type: String,
                        required: true
                    },

                    // Ordered quantity
                    quantity: {
                        type: Number,
                        required: true
                    },

                    // Colour selected by the customer
                    colour: {
                        type: String,
                        required: true
                    },

                    // Product name
                    name: {
                        type: String,
                        required: true
                    },

                    // Product price at the time of ordering
                    price: {
                        type: Number,
                        required: true
                    },

                    // Product image
                    image: {
                        type: String,
                        required: true
                    }
                }
            ]
        },

        // Customer information
        customerName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        // Shipping address
        address: {
            type: String,
            required: true
        },

        // Total order amount
        total: {
            type: Number,
            required: true
        },

        // Order status
        status: {
            type: String,
            required: true,
            default: "pending"
        },

        // Order creation date
        date: {
            type: Date,
            default: Date.now
        }
    }
);

// Create Order model
const Order = mongoose.model("Order", orderSchema);

export default Order;