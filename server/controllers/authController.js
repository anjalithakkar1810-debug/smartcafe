import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || 'smartcafe_secret_token_key_98765',
        {
            expiresIn: '30d',
        }
    );
};
export const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
      try {
        const userExists = await User.findOne({ username });
        if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        const user = await User.create({ username, password, role });
        res.status(201).json({
          _id: user._id,
          username: user.username,
          role: user.role,
          token: generateToken(user._id),
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
      }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
      try {
        const user = await User.findOne({ username });
        if (user && (await user.comparePassword(password))) {
          res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
          });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
        }   
};