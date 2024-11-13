import React, { useEffect, useState } from 'react';

export const CommentForm = ({ user, postId, handleCommentSubmit }) => {

    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);



    const onCommentSubmit = (e) => {
      e.preventDefault();
      if (user.name && comment) {
        let username = user.name
        const newComment = {
          username,
          comment,
          image: image ? URL.createObjectURL(image) : null // Handle the image if it exists
        };
        
        console.log(user.name);
        console.log(postId);
        handleCommentSubmit(postId, newComment);
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
      <form onSubmit={(e)=> onCommentSubmit(e)} style={styles.form}>
        {/** Removing this div because we can use the logged in user's name here instead */}
        <p>Commenting as <strong>{user.name}</strong></p>
        
        
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

  
const styles = {
    container: {
      margin: '0 auto',
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