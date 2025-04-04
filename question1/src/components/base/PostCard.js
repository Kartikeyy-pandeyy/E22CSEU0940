import React from 'react';
import '../style/PostCard.css';

const PostCard = ({ post }) => (
  <div className="post-card">
    <p>{post.content}</p>
    {post.commentCount !== undefined ? (
      <p>Comments: {post.commentCount}</p>
    ) : (
      <p>Posted: {new Date(post.timestamp).toLocaleString()}</p>
    )}
  </div>
);

export default PostCard;