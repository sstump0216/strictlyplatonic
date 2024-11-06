
import React, { useEffect, useState } from 'react';
import LogoutButton from "./LogoutButton";
import './UserCard.css';  
    


const UserCard = ({ handleClick, user, userInfo }) => {

     const [profilePicture, setProfilePicture] = useState(user.picture);
     const [name, setName] = useState(user.name);
     const [nickname, setNickName] = useState(user.nickname);

    useEffect(() => {

        if(Object.values(userInfo).length > 0){
            setProfilePicture(userInfo[0]["user_metadata"].picture)
            setName(userInfo[0]["name"])
            setNickName(userInfo[0]["nickname"])
        }


    //this determines if the api has updated the user information, and will re-render this component
    }, [userInfo])





    return (
        <div className="userCardContainer">
            
            <img src={profilePicture} alt={user.name} />
            <h2>{name}</h2>
            <p>@{nickname}</p>
            <hr />
            <div onClick={() => {handleClick("myprofile")}} >
                <h3>Edit Profile</h3>
            </div>
            <hr />
            <div onClick={() => {handleClick("userprofile")}}>
                <h3>Friends</h3>
            </div>
    
            <hr />
            <LogoutButton />
        </div>


    )


}

    export default UserCard; 