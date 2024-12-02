import User from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';
import multer from 'multer';

// Multer configuration for image uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

export const getUserProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select('-password').select('-created_at');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -created_at'); // Exclude unnecessary fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user list', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const userId = getUserIdFromToken(req);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    const { username, bio } = req.body;
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // Check if a file is provided and upload it to Cloudinary
    if (req.file) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ message: 'Image upload error', error: error.message });
          }
          if (result && result.secure_url) {
            user.profile_image = result.secure_url; // Update profile image
          }

          // Save updated user data
          const updatedUser = await user.save();
          res.status(200).json(updatedUser);
        }
      );

      // Pipe file to Cloudinary
      bufferStream.pipe(uploadStream);
    } else {
      // Save only text updates
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Profile update error', error: error.message });
  }
};

// Export upload configuration
export const uploadProfileImage = upload.single('profile_image');
