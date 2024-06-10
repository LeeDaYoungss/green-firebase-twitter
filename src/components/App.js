import '../App.css';
import React, { useEffect, useState } from "react";
import AppRouter from './Router';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const[isLoggedIn, setIsloggedIn] = useState(false);
  const[init, setInit] = useState(false);
  const auth = getAuth();

  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if (user) {
        // const uid = user.uid;
        setIsloggedIn(true);
      } else {
        // user is signed out.
        setIsloggedIn(false);
      }
      setInit(true);
    })
  },[]);

  return (
    <>
      {init ?
        <AppRouter isLoggedIn={isLoggedIn}/>
        :"Intializing..."
      }
    </>
  )
};
  

export default App;
