const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    passport = require("passport");

// Load User Model
const User = require("../models/user");

// Register User
router.post("/", function(request, response) {
    let { username, email, password, password2 } = request.body;

    if (!username) {
        return response.status(400).json({ message: "Please enter your name" });
    }

    if (!email) {
        return response.status(400).json({ message: "Please enter your email" });
    }

    if (!password) {
        return response.status(400).json({ message: "Please enter password" });
    }

    if (!password2) {
        return response.status(400).json({ message: "Please confirm password" });
    }

    if (password != password2) {
        return response.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
        return response.status(400).json({ message: "Password must be at least 6 character long" });
    }

    User.findOne({ username: username }, function(error, user) {
        if (user) {
            response.status(400).json({ message: "Username not available" });
        } else {
            let newUser = new User({ username, email, password });
            bcrypt.genSalt(10, function(error, salt) {
                bcrypt.hash(newUser.password, salt, function(error, hash) {
                    if (error) throw error;
                    newUser.password = hash;
                    newUser.save(function(error, user) {
                        if (error) {
                            return response.json({ error: error });
                        }
                        response.json(user);
                    });
                });
            });
        }
    });
});

// Login User
router.post("/login", function(request, response, next) {
    User.findOne({ username: request.body.username }, function(error, foundUser) {
        if (error || !foundUser) {
            return response.status(400).json({ message: "Invalid Username or Password" });
        }
        bcrypt.compare(request.body.password, foundUser.password, function(error, result) {
            if (error) {
                return response.status(400).json({ message: "Invalid Username or Password" });
            }
            if (result) {
                const token = jwt.sign({
                        username: foundUser.username,
                        userId: foundUser._id
                    },
                    "secret_key", {
                        expiresIn: "1h"
                    }
                );
                return response.status(200).json({ message: "Login Successful", token: token });
            }
            return response.status(400).json({ message: "Invalid Username or Password" });
        });
    });
});

// Logout User
router.get("/logout", function(request, response) {
    request.logout();
    response.json({ message: "You're successfully logged out" });
});


module.exports = router;