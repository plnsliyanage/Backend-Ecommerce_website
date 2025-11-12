import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {


    if (!isAdmin(req)) {
        res.status(403).json({
            message: "you are not authorized to create a product"
        });
        return;
    }

    try {
        const productData = req.body;
        const product = new Product(productData); // ✅ corrected: use capital 'P' for model
        await product.save(); // ✅ corrected: lowercase variable for instance

        res.json({
            message: "Product created successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ // ✅ corrected: 'resizeBy' → 'res'
            message: "Failed to create product"
        });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find(); // ✅ corrected: 'products' → 'Product'
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "failed to retrieve products",
        });
    }
}

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "You are not authorized to delete products"
        });
        return;
    }

    try {
        const productID = req.params.productID;

        const result = await Product.deleteOne({ productID: productID });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to delete Products"
        });
    }
}
export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "You are not authorized to update a products"
        });
        return;
    }
    try {
        const productID = req.params.productID;
        const updateData = req.body;
        await Product.updateOne(
            { productID: productID },
            updateData
        );
        res.json({
            message: "Product updated successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: " Failed to update product",
        });
    }
}

export async function getProductId(req, res) {
    try {
        const productID = req.params.productID;
        const product = await Product.findOne(
            {
                productID: productID
            }
        )
        if (product == null) {
            res.status(404).json({
                message: "Product not found"
            })
        } else {
            res.json(product);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retriev product by ID",
        });
    }
}
