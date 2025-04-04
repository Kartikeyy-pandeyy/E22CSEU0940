import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts, getPostComments } from '../api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    postCard: {
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      marginBottom: '1rem',
    },
    image: {
      width: '200px',
      height: '200px',
      borderRadius: '4px',
      marginBottom: '0.5rem',
    },
    content: {
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    commentCount: {
      color: '#666',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
    }
  };

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users);

        let allPosts = [];
        for (const [userId] of users) {
          const postsResponse = await getUserPosts(userId);
          allPosts = allPosts.concat(postsResponse.data.posts);
        }

        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            const commentsResponse = await getPostComments(post.id);
            return { ...post, commentCount: commentsResponse.data.comments.length };
          })
        );

        const maxComments = Math.max(...postsWithComments.map(p => p.commentCount));
        const trending = postsWithComments.filter(p => p.commentCount === maxComments);
        setTrendingPosts(trending);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Trending Posts</h2>
      <div>
        {trendingPosts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <img 
              src={`https://picsum.photos/200?random=${post.id}`} 
              alt="Post" 
              style={styles.image}
            />
            <p style={styles.content}>{post.content}</p>
            <p style={styles.commentCount}>Comments: {post.commentCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;