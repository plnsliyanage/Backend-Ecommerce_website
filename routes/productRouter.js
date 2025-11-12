import express from "express";
import { createProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
import { getProducts, getProductId } from "../controllers/productController.js";
const productRouter = express.Router();

productRouter.get("/", getProducts)
productRouter.post("/", createProduct)
productRouter.get("/search", (req, res) => {
    res.json({
        message: "searching !"
    })
})
productRouter.delete("/:productID", deleteProduct)
productRouter.put("/:productID", updateProduct)
productRouter.get("/:productID", getProductId)





export default productRouter;