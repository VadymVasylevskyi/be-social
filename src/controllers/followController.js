import Follow from '../models/followModel.js';
import User from '../models/userModel.js';

// Get all followers
export const getUserFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ follower_user_id: req.params.userId }).populate('follower_user_id', 'username');
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get following
export const getUserFollowing = async (req, res) => {
  try {
    console.log(req.params.userId)

    const following = await Follow.find({ followed_user_id: req.params.userId }).populate('followed_user_id', 'username');
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Follow
export const followUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // To-Do
    const existingFollow = await Follow.findOne({ follower_user_id: userId, followed_user_id: targetUserId });
    if (existingFollow) {
      return res.status(400).json({ error: 'You are already subscribed to this user' });
    }

    const follow = new Follow({
      follower_user_id: userId,
      followed_user_id: targetUserId,
      user_id: userId,
      created_at: new Date(),
    });

    user.following_count += 1;
    targetUser.followers_count += 1;
    await user.save();
    await targetUser.save();
    await follow.save();
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Unfollow
export const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const follow = await Follow.findOne({ follower_user_id: userId, followed_user_id: targetUserId });
    if (!follow) {
      return res.status(404).json({ error: 'You are not subscribed to this user' });
    }

    await Follow.findByIdAndDelete(follow._id);

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    user.following_count -= 1;
    targetUser.followers_count -= 1;

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: 'You have unsubscribed from a user' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};