
import React, { useEffect, useState } from 'react';
import { updateUserPicture, updateUserInfo, updateUserSchedule } from '../services/user_services';
import { useUserInfo } from '../utils/userContext';
import Schedule from './Schedule';
import '../bio.css';
import axios from "axios";
import BackButton from './BackButton';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export const MyProfile = () => {
  
   const location = useLocation();
   const { user } = location.state || {};
   const { isAuthenticated} = useAuth0();

   if(isAuthenticated == false) {
    return <Navigate to='/' replace={true} />
   }

   const {userInfo, fetchData} = useUserInfo();


   // Changing this so that if the user logs in and they have a profile picture already
   // then this picture will be the default state.
   const [profilePicture, setProfilePicture] = useState('');
   const [name, setName] = useState('');
   const [bio, setBio] = useState('');
   const [hobbies, setHobbies] = useState([]);
   const [image, setImage] = useState(''); // for the user profile picture-- different from photos!!
   const [imageUrl, setImageUrl] = useState("");
   const [errors, setErrors] = useState({});
   const [schedule, setSchedule]= useState([]);

   //from the UserContext hook
  

   // On initial render, if there are items that have been changed, then will load them from the localStorage.
   useEffect(() => {
  
       try {
           
           const user_name = userInfo[0].name;
          
           if(userInfo[0].user_metadata) {
               const user_pfp = userInfo[0].user_metadata.picture;
               const user_bio = userInfo[0].user_metadata.bio || ''
               const user_hobbies = userInfo[0].user_metadata.hobbies || [];
               const user_schedule = userInfo[0].user_metadata.schedule || [];
               setProfilePicture(user_pfp);
               setBio(user_bio);
               setHobbies(user_hobbies.join(", "));
               setSchedule(user_schedule);
           } else {
             setProfilePicture(userInfo[0].picture);
           }
          
          
           
           setName(user_name);
          

       } catch (error) {
          
           console.log(error);
       }
     
   }, []);

   const handleFileChange = (event) => {
      
       const file = event.target.files[0];
      
       if (file) {
           const reader = new FileReader();
           reader.onload = (e) => {
               setProfilePicture(e.target.result);
           };
           reader.readAsDataURL(file);
           setImage(file);
         
       }
   };

   const editSchedule = async (s) => {
        if(user.sub) {
            try {
               console.log(s);
               const user_schedule = await updateUserSchedule(user.sub, s);
               const f = fetchData();
               setSchedule(s);
               console.log("Schedule successfully updated.");
               
            } catch (error) {
               console.log(error)
            }
        }
   }

   // Vaildation for name, bios, and hobbies and certain requirments must be met.
   const validateForm = () => {
       const newErrors = {};
       if (!name || name.length > 50) {
           newErrors.name = 'Name is required and should be less than 50 characters. ';
       }
       if (!bio || bio.length > 300) {
           newErrors.bio = 'Please provide a bio! Keep it less than 300 characters. ';
       }
       if (!hobbies) {
           newErrors.hobbies = 'Please enter in your hobbies! Hobbies are required. We ask you to provide this information so that potential friends can know what you like to do!';
       }
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
   };

   const handleEditSubmit = async (event) => {
       event.preventDefault();
       if (validateForm()) { // validating form . If it fails, storing should be stopped and prevent unwanted data
      
           const data = {
               'name': name,
               'bio': bio,
               'hobbies': hobbies == 'enter your hobbies here as comma separated values :-)' ? [] : hobbies.trim().split(', ')
           }
           const u = await updateUserInfo(user.sub, data);
           const f = await fetchData();
           alert('Your profile has been updated successfully!');
       }
   };


   // photo upload
   const handleUpload = async (event) => {
       event.preventDefault();
       if (!image) {
         alert("Please select an image to upload!");
         return;
       }
      
       const formData = new FormData();
       formData.append("file", image);
       formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_PRESET}`);
  
       try {
         const response = await axios.post(
           `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
           formData
         );
         //Upon receiving the url from cloudinary, we then give this information to the auth0 database
         setImageUrl(response.data.secure_url);
        
         alert("Image uploaded successfully!");
       } catch (error) {
         console.error("Error uploading image:", error);
         alert("Failed to upload image");
       }
     };
  
     useEffect(() => {
       if(imageUrl) {
           const update_picture= async () => {
               const u = await updateUserPicture(user.sub,  imageUrl);
               const f = await fetchData();
               console.log('finished');
           }
           update_picture();
           setProfilePicture(imageUrl);
       }
     }, [imageUrl]);
     

    

     return (
       <>

         <div className='postContainer'>
           <BackButton />
           <div style={styles.profileContainer}>
             {profilePicture && (
               <img id="preview" src={profilePicture} alt="Profile Preview" style={{ display: 'block' }} />
             )}
             {/*made these changes for the styling*/}
             <form id="uploadForm" onSubmit={handleUpload} style={styles.upload}>
               <label htmlFor="profilePicture" style={styles.label}>
                 Change profile picture:
               </label>
               <input
                 type="file"
                 id="profilePicture"
                 accept="image/*"
                 onChange={handleFileChange}
                 required
                 style={styles.input}
               />
               <br />
               <button type="submit" style={styles.button}>
                 Upload
               </button>
             </form>
           </div>
  
           {/* Profile Info */}
           <div className="profile" style={styles.profileInfo}>
             <h2>Profile Information</h2>
             <p><strong>Name:</strong> <span>{name}</span></p>
             <p><strong>Email:</strong> <span>{user.email}</span></p>
             <p><strong>Bio:</strong> <span>{bio}</span></p>
             <p><strong>Hobbies:</strong> <span>{hobbies}</span></p>
           </div>
  
           {/* Edit profile form */}
           <div style={styles.postContainer}>
             <h1 style={styles.header}>Edit Profile</h1>
             <form id="editForm" onSubmit={handleEditSubmit}>
               <label htmlFor="name">Name:</label><br />
               <input
                 type="text"
                 id="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
               />
               {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
               <br /><br />
  
               <label htmlFor="bio">Bio:</label><br />
               <textarea
                 id="bio"
                 rows="4"
                 value={bio}
                 onChange={(e) => setBio(e.target.value)}
               />
               {errors.bio && <p style={{ color: 'red' }}>{errors.bio}</p>}
               <br /><br />
  
               <label htmlFor="hobbies">Hobbies:</label><br />
               <textarea
                 id="hobbies"
                 rows="4"
                 value={hobbies}
                 onChange={(e) => setHobbies(e.target.value)}
               />
               {errors.hobbies && <p style={{ color: 'red' }}>{errors.hobbies}</p>}
               <br /><br />
               <button type="submit">Save Changes</button>
             </form>
           </div>

            {/* Photos  */}
                {/* <div style={styles.postContainer}>
                    <h2>Post photos to your profile!</h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                    />
                    <div>
                        {photos.map((photo, index) => (
                            <img key={index} src={photo} alt={`Uploaded ${index}`} style={{ width: '100px', margin: '10px' }} />
                        ))}
                    </div>
                </div> */}


           {/* Scheduling */}

           <Schedule editSchedule={editSchedule} userSchedule= {schedule}/>

         </div>
       </>
     );
   };

const styles = {
    postContainer: {
      border: '2px solid #ddd',
      marginBottom: '20px',
      padding: '3em',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      background: 'linear-gradient(21deg, #65558f, #a69ac7)', 
      textAlign: 'center',
    },
    header: {
      fontSize: '35px',
      marginBottom: '20px',
      fontWeight: 'bold',
      margin: '5px 0',
    },
    threadContainer: {
      border: '1px solid #ddd',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center', // Center the text
    },
    label: {
      marginBottom: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      
    },
    upload: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
    },
    input: {
      marginBottom: '20px',
      padding: '8px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '100%', // Make input fill available width
    },
    
    
  };
