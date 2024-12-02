import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: getUserIdFromToken(req) });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user posts' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

export const createPost = async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { caption } = req.body;

  try {
    // Get image
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    let image_url = 'test';

    cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Upload error' });
      }
      image_url = result.secure_url;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!req.file) return res.status(400).json({ error: 'Image not provided' });

      const post = new Post({
        user_id: userId,
        image_url,
        user_name: user.username,
        profile_image: user.profile_image,
        caption,
        created_at: new Date(),
      });

      await post.save();

      user.posts_count += 1;
      await user.save();

      res.status(201).json(post);
    }).end(req.file.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(post.user_id);
    user.posts_count -= 1;
    await user.save();

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('user_id', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { caption, image_url } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (caption !== undefined) post.caption = caption;
    if (image_url !== undefined) post.image_url = image_url;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
};
