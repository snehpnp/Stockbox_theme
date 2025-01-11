const db = require("../Models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Users_Modal = db.Users;
const { sendEmail } = require("../Utils/emailService");
const nodemailer = require("nodemailer");

class Users {
  async loginUser(req, res) {
    try {
      const { UserName, password } = req.body;

      if (!UserName) {
        return res
          .status(400)
          .json({ status: false, message: "username is required" });
      }
      if (!password) {
        return res
          .status(400)
          .json({ status: false, message: "password is required" });
      }

      const user = await Users_Modal.findOne({
        UserName: UserName,
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found or account is inactive",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      return res.json({
        status: true,
        message: "Login successful",
        data: {
          FullName: user.FullName,
          Email: user.Email,
          PhoneNo: user.PhoneNo,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { Email } = req.body;

      if (!Email) {
        return res
          .status(400)
          .json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid email format" });
      }
      // Find the user by email
      const user = await Users_Modal.findOne({ Email });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User with this email does not exist",
        });
      }

      // Generate a reset token
      const resetToken = Math.floor(100000 + Math.random() * 900000);

      // Set the token and expiry on the user
      user.forgotPasswordToken = resetToken;
      user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour from now

      await user.save();

      const mailOptions = {
        to: user.Email,
        from: `"Pnp" <info@pnpuniverse.com>`, // Include business name
        subject: "Verification Mail",
        html: `Your verification code is: ${resetToken}. This code is valid for 10 minutes. Please do not share this code with anyone.....`, // Use backticks for template literals
      };

      // Send email
      await sendEmail(mailOptions);

      return res.json({
        status: true,
        message: "Reset token sent to email",
      });
    } catch (error) {
      console.log("Error in forgotPassword:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json({
          status: false,
          message: "Reset token and new password are required",
        });
      }

      // Find the user by reset token and check if the token is valid
      const user = await Users_Modal.findOne({
        forgotPasswordToken: resetToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() }, // Token should not be expired
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Invalid or expired reset token",
        });
      }

      // Hash the new password

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear the reset token
      user.password = hashedPassword;
      user.forgotPasswordToken = undefined; // Clear the token
      user.forgotPasswordTokenExpiry = undefined; // Clear the expiry

      await user.save();

      return res.json({
        status: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.log("Error in resetPassword:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { id, currentPassword, newPassword } = req.body;

      if (!id || !currentPassword || !newPassword) {
        return res.status(400).json({
          status: false,
          message: "User ID, current password, and new password are required",
        });
      }

      const user = await Users_Modal.findOne({ _id: id });
      // Check if the current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Current password is incorrect",
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      return res.json({
        status: true,
        message: "Password changed successfully",
      });
    } catch (error) {
   
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { id, FullName, Email, PhoneNo } = req.body;

      if (!FullName) {
        return res
          .status(400)
          .json({ status: false, message: "fullname is required" });
      }
      if (!Email) {
        return res
          .status(400)
          .json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid email format" });
      }

      if (!PhoneNo) {
        return res
          .status(400)
          .json({ status: false, message: "phone number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid phone number format" });
      }

      // Ensure the user ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
        });
      }

      // Find the user by ID
      const user = await Users_Modal.findById(id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Update the user's profile information
      if (FullName) user.FullName = FullName;
      if (Email) user.Email = Email;
      if (PhoneNo) user.PhoneNo = PhoneNo;

      // Save the updated user profile
      await user.save();

      return res.json({
        status: true,
        message: "Profile updated successfully",
        data: {
          id: user.id,
          FullName: user.FullName,
          Email: user.Email,
          PhoneNo: user.PhoneNo,
        },
      });
    } catch (error) {
     
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}

module.exports = new Users();
