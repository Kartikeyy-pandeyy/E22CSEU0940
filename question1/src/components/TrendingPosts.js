import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts, getPostComments } from '../api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      width: '90%',
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#333',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #007bff, #00c4ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    postCard: {
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      borderLeft: '4px solid #007bff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    image: {
      width: '100%',
      maxWidth: '300px',
      height: 'auto',
      borderRadius: '8px',
      border: '1px solid #eee',
      alignSelf: 'center',
    },
    content: {
      fontWeight: '600',
      fontSize: '1.1rem',
      color: '#1a1a1a',
      marginBottom: '0.75rem',
    },
    commentCount: {
      color: '#777',
      fontSize: '0.95rem',
      fontStyle: 'italic',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#007bff',
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