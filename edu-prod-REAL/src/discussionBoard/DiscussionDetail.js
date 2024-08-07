import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  discussionImages: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  discussionImage: {
    maxWidth: '300px',
    borderRadius: '5px',
  },
  commentsSection: {
    width: '100%',
    maxWidth: '800px',
    marginTop: '20px',
  },
  comment: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    width: '100%',
    maxWidth: '800px',
  },
  commentInput: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    fontSize: '1rem',
    width: '100%',
  },
  commentButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
};

const DiscussionDetail = () => {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/discussions/${discussionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Handle authentication
          }
        });
        setDiscussion(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch discussion:', error);
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/discussions/${discussionId}/comments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Handle authentication
          }
        });
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchDiscussion();
    fetchComments();
  }, [discussionId]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/discussions/${discussionId}/comments`, 
      { content: newComment }, 
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Handle authentication
        }
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  if (loading) {
    return <p>Loading discussion details...</p>;
  }

  if (!discussion) {
    return <p>Discussion not found</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{discussion.title}</h1>
      <p>Posted by: {discussion.userId?.email}</p>
      <p>Date: {new Date(discussion.createdAt).toLocaleString()}</p>
      <p>{discussion.description}</p>
      {discussion.images && discussion.images.length > 0 && (
        <div style={styles.discussionImages}>
          {discussion.images.map((image, index) => (
            <img key={index} src={`http://localhost:5000/${image}`} alt={`Discussion ${index}`} style={styles.discussionImage} />
          ))}
        </div>
      )}
      <div style={styles.commentsSection}>
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment._id} style={styles.comment}>
            <p>{comment.content}</p>
            <p><small>Posted by: {comment.userId?.email} on {new Date(comment.createdAt).toLocaleString()}</small></p>
          </div>
        ))}
        <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={styles.commentInput}
            required
          />
          <button type="submit" style={styles.commentButton}>Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionDetail;
