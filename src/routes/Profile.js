import React, {useEffect, useState} from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, getDocs, onSnapshot, query, orderBy } from "firebase/firestore"; 

const Profile = ()=> {
  const[profileImg, setProfileImg] = useState(`${process.env.PUBLIC_URL}/profile_icon.svg`);
  const auth = getAuth();
  const navigate = useNavigate();
  console.log(auth);

  const logOut = ()=> signOut(auth).then(() => {
    // Sign-out successful.
    navigate('/');
  }).catch((error) => {
    // An error happened.
  });

  const updateLogo = async (e)=>{
    const {target:{files}} = e;
    const file = files[0];
    const storage = getStorage();
    const profileLogoRef = ref(storage, `profile/${auth.currentUser.uid}`);
    const result = await uploadBytes(profileLogoRef, file);
    console.log(result);
    const profileUrl = await getDownloadURL(result.ref);
    console.log(profileUrl);
    setProfileImg(profileUrl);
    await updateProfile(auth.currentUser, {
      photoURL:profileUrl
    })
  }

  useEffect(()=>{
    auth.currentUser.photoURL.includes('firebase') && setProfileImg(auth.currentUser.photoURL);
  },[]);
  return(
    <>
    <div className="profile">
      <img src={profileImg} alt="" />
      <input type="file" className="hidden" id="profile" accept="image/*" onChange={updateLogo} />
    </div>
      <h3>{auth.currentUser.displayName}</h3>
      <label htmlFor="profile">프로필 수정</label>
      <button onClick={logOut}>Logout</button>
      <hr />
      <h4>My p ost</h4>
    </>
  )
}

export default Profile;