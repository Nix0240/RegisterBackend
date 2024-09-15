import { User } from "../database/models/index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import {
  sendEmail,
  generateVerificationEmail,
} from "../services/emailVerification.js";


export default {
  async Signup(req, res) {
    try {
      const { email, firstName, lastName, password, role } = req.body;

      const user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      
      const generateRandomString = (length = 10) => {
        return crypto
          .randomBytes(Math.ceil(length / 2)) 
          .toString("hex") 
          .slice(0, length);
      };

      const hashedPassword = await bcrypt.hash(password, 10);
      const generetaedString = generateRandomString();
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        emailOtp: generetaedString,
        isVerified: false,
      });

      const link = `http://localhost:8022/user/verify-email/?verificationString=${generetaedString}&email=${email}`;

      const mailBody = generateVerificationEmail(link);

      await sendEmail(email, "Verification Email", mailBody);

      return res.status(200).json({
        success: true,
        data: newUser,
        message: `${role} registered successfully. Please check your email to verify your account.`,
      });
    } catch (error) {
      console.error("Signup error: ", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  async Login(req, res) {
    const { email, password, role } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email before logging in.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials.",
        });
      }

      if (role === "admin" && user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to login as admin.",
        });
      } else if (role !== "admin" && user.role === "admin") {
        return res.status(403).json({
          role: "customer",
          success: false,
          message: "You are not allowed to login as customer.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  async verifyEmail(req, res) {
    const { verificationString, email } = req.query;

    try {
      const user = await User.findOne({
        where: {
          emailOtp: verificationString,
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found!",
        });
      }

      await User.update(
        {
          emailOtp: null,
          isVerified: true,
        },
        {
          where: {
            email,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Email verified successfully.",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
};
