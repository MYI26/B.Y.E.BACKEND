const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const emailUsed = await User.findOne({ email });
    if (emailUsed && emailUsed._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'This email is already in use' });
    }

    user.email = email;
    await user.save();
    res.json({ message: 'Email updated', email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.email !== email) {
      return res.status(403).json({ message: 'Incorrect email' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMe = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password required' });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
