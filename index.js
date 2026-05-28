import express from "express";
import mongoose from "mongoose";


import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import productRouter from "./routes/productRouter.js";


dotenv.config()
// fully furnitized backend software  is assing to variable called app
const app = express()

app.use(cors())
//middleware
app.use(express.json())

//middleware to check token
app.use(

    (req, res, next) => {
        let token = req.header("Authorization")
        if (token != null) {
            token = token.replace("Bearer ", "")

            //decrypt the token 

            jwt.verify(token, process.env.JWT_SECRET,
                (err, decoded) => {
                    if (decoded == null) {
                        res.json({
                            message: "Invalid token please login again"
                        })
                        return
                    } else {
                        req.user = decoded
                    }
                })
        }
        next()

    }



)






//databse connected
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString).then(
    () => {
        console.log("Database Connected")
    }
).catch(
    () => {
        console.log("Databse connection fail")
    }
)


app.use("/api/users", userRouter)
app.use("/api/products", productRouter)

// run backend
app.listen(5000, () => {
    console.log("server is runing port 5000")

})