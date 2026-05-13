import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"

export const register = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const JWT_SECRET = process.env.JWT_SECRET

  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email, isPremium: user.isPremium } });
  } catch (err) {
    console.error("Registration Error: ", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Manual Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.password) return res.status(400).json({ message: 'Please login with Google' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, profilePic: user.profilePic, isPremium: user.isPremium } });
  } catch (err) {
    console.error("Login Error: ", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Google Login
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { sub: googleId, email, name, picture } = ticket.getPayload();
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email, googleId, profilePic: picture });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.profilePic = user.profilePic || picture;
      await user.save();
    }
    
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, profilePic: user.profilePic, isPremium: user.isPremium } });
  } catch (err) {
    console.error("Google Auth Error: ", err);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};