import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Customer/Admin Signup
router.post("/sign-up", userController.Signup);

// Login for Admin
router.post("/login", userController.Login);

// Verfication
router.get("/verify-email", userController.verifyEmail);

export default router;
