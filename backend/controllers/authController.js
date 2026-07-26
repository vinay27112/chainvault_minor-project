import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
//import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL,
    //   to: email,
    //   subject: "Welcome to NuraBytes!",
    //   text: `Hello ${name},\n\nThank you for registering at NuraBytes. We're excited to have you on board!\n\nBest regards,\nThe NuraBytes Team`,
    // };

    //await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const sendVerifyOtp = async (req, res) => {
//   try {
//     const userID = req.user.id; // from auth middleware

//     const user = await userModel.findById(userID);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.isAccountVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Account already verified",
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.verifyOtp = otp;
//     user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await transporter.sendMail({
//       from: process.env.SENDER_EMAIL,
//       to: user.email,
//       subject: "Your Verification OTP",
//       text: `Hello ${user.name},

// Your OTP for account verification is: ${otp}
// It is valid for 10 minutes.

// Regards,
// NuraBytes Team`,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent to your email",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const verifyEmail = async (req, res) => {
  try {
    const userID = req.user.id; // from auth middleware
    const { otp } = req.body;
    if (!userID || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID or OTP missing",
      });
    }

    const user = await userModel.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    if (
      String(user.verifyOtp) !== String(otp) ||
      Date.now() > user.verifyOtpExpireAt
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const sendResetOtp = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Email is required" });
//   }

//   try {
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.resetOtp = otp;
//     user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
//     await user.save();

//     await transporter.sendMail({
//       from: process.env.SENDER_EMAIL,
//       to: user.email,
//       subject: "Your Password Reset OTP",
//       text: `Hello ${user.name},

//         Your OTP for password reset is: ${otp}
//         It is valid for 10 minutes.

//         Regards,
//         NuraBytes Team`,
//     });
//     res.status(200).json({ success: true, message: "OTP sent to your email" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (
      String(user.resetOtp) !== String(otp) ||
      String(otp) === "" ||
      Date.now() > user.resetOtpExpireAt
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
