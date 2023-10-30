import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User  from "../models/user.js"; 

export const signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
                lastName:req.body.lastName,
                firstName:req.body.firstName,
                role:req.body.role
            });
            user.save()
                .then((response) => {
                    const newUser = response.toObject(); 
                    delete newUser.password;
                    res.status(201).json({
                        user: newUser,
                        message: "User created!",
                    });
                })
                .catch((error) => res.status(400).json({ error: error }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};

export const login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "Login or password incorrect" });
            }

            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ message: "Login or password incorrect" });
                    }

                    const token = jwt.sign({ userId: user._id }, "Random_TOKEN_SECRET", {
                        expiresIn: "24h",
                    });

                    res.status(200).json({
                        token: token,
                        expiresIn: "24h",
                    });
                })
                .catch((error) => res.status(500).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};
