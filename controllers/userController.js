import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create a new user
export function createUser(req, res) {
    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword
    });

    user.save()
        .then(() => {
            // 201 Created - success
            res.status(201).json({
                message: "User created successfully"
            });
        })
        .catch((err) => {
            console.error(err);
            // 500 Internal Server Error
            res.status(500).json({
                message: "Failed to create user"
            });
        });
}

// Login an existing user
export function loginUser(req, res) {
    User.findOne(
        {
            email: req.body.email
        }
    ).then((user) => {
        if (user == null) {
            res.status(404).json(
                {
                    message: "User not found"
                }

            )
        } else {
            const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password)
            if (isPasswordMatching) {

                //create token and assing what are the detailes should contain in the token
                const token = jwt.sign(
                    {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified
                    },
                    //encrypted key
                    "jwt-secret"
                )
                res.json({
                    message: "Login successfull",
                    token: token
                })

            } else {
                res.status(403).json({
                    message: "Invalid password"

                }
                )
            }
        }

    }
    )
}


// Check if the user is admin
export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role != "admin") {
        return false;
    }
    return true;
}
