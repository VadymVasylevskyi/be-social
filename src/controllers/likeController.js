import Like from '../models/likeModel.js';
import Post from '../models/postModel.js';


export const getPostLikes = async (req, res) => {
  try {
    const likes = await Like.find({ post_id: req.params.postId });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: 'Error receiving likes' });
  }
};


export const likePost = async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'The post was not found' });

    const existingLike = await Like.findOne({ post_id: postId, user_id: userId });
    if (existingLike) return res.status(400).json({ error: 'The post has already been liked' });

    const like = new Like({
      post_id: postId,
      user_id: userId,
      created_at: new Date(),
    });

    await like.save();

    post.likes_count += 1;
    await post.save();

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Error when liking a post' });
  }
};


export const unlikePost = async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const like = await Like.findOne({ post_id: postId, user_id: userId });
    if (!like) return res.status(404).json({ error: 'Like not found' });

    await Like.findByIdAndDelete(like._id);

    const post = await Post.findById(postId);
    post.likes_count -= 1;
    await post.save();

    res.status(200).json({ message: 'Unlike' });
  } catch (error) {
    res.status(500).json({ error: 'Error when deleting a like' });
  }
};