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

    (res, req, next) => {
        const token = req.header("Authorization")
        if (token != null) {
            token = token.replace("Bearer ", "")
            console.log(token)
            //decrypt the token 
            jwt.verify(token, "jwt-secret",
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
const connectionString = "mongodb+srv://admin:123@cluster0.skre8hh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connectionString).then(
    () => {
        console.log("Database Connected")
    }
).catch(
    () => {
        console.log("Databse connection fail")
    }
)


app.use("/users", userRouter)
app.use("/products", productRouter)

// run backend
app.listen(5000, () => {
    console.log("server is runing port 5000")

})