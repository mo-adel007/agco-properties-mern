import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {

 // First check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    // If email doesn't exist, create the new user
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    next(errorHandler(500, "Error from the function"));
  }
};
export const signin = async (req, res, next) => {
  const { email, password, captchaToken, mode } = req.body;
  
  try {
	const isDevelopment = mode === 'development' && process.env.NODE_ENV === 'development'
    // Skip CAPTCHA verification in development mode
	if(!isDevelopment) {
    // Verify CAPTCHA token
    if (!captchaToken) {
      return next(errorHandler(400, "CAPTCHA verification required"));
    }

    // Verify the CAPTCHA token with Google's API
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    
    const recaptchaRes = await fetch(verificationURL, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return next(errorHandler(400, "CAPTCHA verification failed"));
    }
   }

    // Continue with existing authentication logic
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Wrong Username or Password"));

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      }
    );
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
