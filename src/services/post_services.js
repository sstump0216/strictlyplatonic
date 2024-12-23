import { addDoc } from "firebase/firestore/lite";

import { initializeApp } from "firebase/app";
import { getFirestore, query, where, collection, getDoc, getDocs, deleteDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore/lite';


export class Post {

    //class variables 
    app;
    db;
    
    firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSENGER,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      
      };

    constructor () {
      
        this.app = initializeApp(this.firebaseConfig);
        this.db = getFirestore(this.app);
    }

    
    async getPostsData() {
        const postsCol = collection(this.db, 'posts');
        const postSnapshot = await getDocs(postsCol);
        const postList = postSnapshot.docs.map(e => e.data());
        
        const postIdList = postSnapshot.docs.map(i => i.id);
        return [postIdList, postList];

    }    

    async createPost(newPost) {
        const postsCol = collection(this.db, 'posts');
        const postSnapshot = await addDoc(postsCol, newPost);
        console.log("Post Created");
        return postSnapshot.id;
    }

    async updatePosts (updated_post, post_id, user_id) {

        if(user_id == updated_post.creator) {
          //this ensures that the person trying to update said post is the same person who created it 
          const docRef = doc(this.db, "posts", post_id);
          const docSnap = await getDoc(docRef);
        
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
          const newDoc = await updateDoc(docRef, updated_post);
          console.log("Post has been updated.");
        }
      }
    
     
    async addComment (post_id, comment) { 
        
         /**
          * PARAMETERS: 
          * 
          * post_id: contains id the of the post to be modified. 
          * 
          * comment: a mapping object that contains not only the 
          * textual content of the comment, but also id of the
          * user writing the comment. 
          * 
          * 
          * 
        */
          console.log(comment);
          const docRef = doc(this.db, "posts", post_id); //get the post by its id
          const docSnap = await getDoc(docRef);
        
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
          
          
          const newDoc = await updateDoc(docRef, {
            comments: arrayUnion(comment)
          });

          console.log("Post has been updated.");
    }

    async updateComment (post_id, updated_post) {  
      const docRef = doc(this.db, "posts", post_id); //get the post by its id
      
      const newDoc = await updateDoc(docRef, updated_post);

      console.log("Post has been updated.");

    }

    async deleteComment (post_id) {  
      const docRef = doc(this.db, "posts", post_id); //get the post by its id
      
      const newDoc = await updateDoc(docRef, updated_post);

      console.log("Post has been updated.");

    }




    //creator_id, url
    async updatePostPictures(creator_id, pic_url) {
      const postsCol = collection(this.db, 'posts');
      
      const q = query(postsCol, where("creator", "==", creator_id))

      const postsSnapshot = await getDocs(q);
      const p = postsSnapshot.docs;
      p.forEach(async (doc) => {
        try {
          const newDoc = await updateDoc(doc.ref, {
            creator_pic: pic_url
          });
          console.log("user post profile picture updated");
        } catch (error) {
          console.log(error)
        }
      })
    }

    async updatePostName(creator_id, updated_name) {
      console.log(updated_name)
      const postsCol = collection(this.db, 'posts');
      
      const q = query(postsCol, where("creator", "==", creator_id))

      const postsSnapshot = await getDocs(q);
      const p = postsSnapshot.docs;
      p.forEach(async (doc) => {
        try {
          const newDoc = await updateDoc(doc.ref, {
            user_name: updated_name
          });
          console.log("user post profile name updated");
        } catch (error) {
          console.log(error)
        }
      })
    }





    async deletePost(post_id) {
      const docRef = doc(this.db, "posts", post_id); //get the post by its id
      const deletedDoc = await deleteDoc(docRef)
       


    }






}