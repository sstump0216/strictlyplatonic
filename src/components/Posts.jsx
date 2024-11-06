import React, { useState } from 'react';
import postsData from "../assets/data/postData.json";

export const Posts = () => {
  const [posts, setPosts] = useState(postsData);
//need to add database so that comments stay after logging out and others can see them-Sierra
  const handleCommentSubmit = (postId, comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
        };
      }
      return post;
    }));
  };

  return (
    <>
      <div style={styles.container}>
        {posts.map(post => (
          <div key={post.id} className="postContainer" style={styles.postContainer}>
            <h1 style={styles.username}>{post.username}</h1>
            <p><strong>Interests:</strong> {post.interests.join(', ')}</p>
            <p>{post.post}</p>
            <p><strong>Date:</strong> {post.date}</p>
            <p><strong>Location:</strong> {post.location}</p>
            <p><strong>Event Planned:</strong> {post.event_planned ? "Yes" : "No"}</p>

            {/* of there, showing image with post */}
            {post.image && <img src={post.image} alt="Post" style={styles.postImage} />}

            <div style={styles.commentsContainer}>
              <h4>Comments:</h4>
              {post.comments.map((comment, index) => (
                <div key={index} style={styles.comment}>
                  <p><strong>{comment.username}:</strong> {comment.comment}</p>
                  {/* to show image with comment */}
                  {comment.image && <img src={comment.image} alt="Comment" style={styles.commentImage} />}
                </div>
              ))}
              <CommentForm postId={post.id} onCommentSubmit={handleCommentSubmit} />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

const CommentForm = ({ postId, onCommentSubmit }) => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (username && comment) {
      const newComment = {
        username,
        comment,
        image: image ? URL.createObjectURL(image) : null // Handle the image if it exists
      };
      
      
      onCommentSubmit(postId, newComment);

      // reset 
      setUsername('');
      setComment('');
      setImage(null); 
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} style={styles.form}>
      <div className="input" style={styles.inputContainer}>
        <input
          type="text"
          placeholder="your display name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      <textarea
        placeholder="add your comment here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        style={styles.textarea}
      />

      {/* upload input for image */}
      <div style={styles.imageUploadContainer}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        {/*  preview of image */}
        {image && <img src={URL.createObjectURL(image)} alt="Preview" style={styles.imagePreview} />}
      </div>

      <button type="submit" style={styles.button}>Submit</button>
    </form>
  );
};
//trying to figure out the style we want for the comment section i just did, feel free if you want to change it up-Sierra

const styles = {
  container: {
    margin: '0 auto',
    padding: '20px',
    maxWidth: '800px',
  },
  postContainer: {
    border: '2px solid #ddd',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  username: {
    fontSize: '35px',
    fontWeight: 'bold',
    color: '#000000',
  },
  commentsContainer: {
    marginTop: '10px',
    //below is for writing in comments, i had to play around with it alot so we can remove some stuff if need be- sierra
  },
  comment: {
    backgroundColor: '#eee',
    padding: '5px',
    margin: '5px 0',
    borderRadius: '3px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
  inputContainer: {
    background: 'linear-gradient(21deg, #d6c7e5, violet)',
    padding: '3px',
  },
  input: {
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    color: '#000000',
    minWidth: '12em',
    padding: '0.325em',
    border: 'none',
    outline: 'none',
    transition: 'all 0.3s',
    backgroundColor: '#e6e6fa',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
    minHeight: '60px',
    background: 'linear-gradient(21deg, #d6c7e5, violet)',
    color: '#000000',
  },
  button: {
    backgroundColor: '#9966CC',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    cursor: 'pointer',
  },
  fileInput: {
    marginTop: '10px',
    padding: '5px',
  },
  imagePreview: {
    marginTop: '10px',
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
  },
  imageUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    
  },
  postImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '15px',
    marginTop: '15px',
    
  },
  commentImage: {
    marginTop: '10px',
    maxWidth: '100px',
    maxHeight: '100px',
    borderRadius: '8px',
    

  },
};

export default Posts;
