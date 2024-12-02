import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

// Get comments
export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Create
export const createComment = async (req, res) => {
  const { postId, userId } = req.params;
  const { comment_text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = new Comment({
      post_id: postId,
      user_id: userId,
      comment_text,
      created_at: new Date(),
    });

    await comment.save();

    post.comments_count += 1;
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(comment.post_id);
    post.comments_count -= 1;
    await post.save();

    res.status(200).json({ message: 'Succesfully deleted ' });
  } catch (error) {
    res.status(500).json({ error: 'Error when deleting a comment' });
  }
};