const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Authentication Middleware
exports.auth = async (req, res, next) => {

    try {
        // Extract token from headers, cookies, or body
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization")?.replace("Bearer ", "");

        console.log("Extracted Token:", token); // ✅ Debugging line

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // ✅ Debugging line
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid: "
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

// Student Role Middleware
exports.isStudent = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User authentication failed",
            });
        }
        if (req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied! This route is for Students only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};

// Instructor Role Middleware
exports.isInstructor = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User authentication failed",
            });
        }
        if (req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied! This route is for Instructors only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};

// Admin Role Middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User authentication failed",
            });
        }
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied! This route is for Admins only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};
