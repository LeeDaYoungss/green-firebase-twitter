import React, { useState } from "react";
import { authService } from "../firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const Auth = ()=> {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[newAccount, setNewAccount] = useState(true);
  const[error, setError] = useState('');
  const auth = getAuth();

  const onChange = (e)=>{

    /*
    const target = e.target;
    const name = target.name;
    const value = target.value;
    */
    const{target:{name,value}} = e; //구조 분해 할당
    if(name === 'email'){
      setEmail(value);
    }else if(name === 'password'){
      setPassword(value);
    }

  }
  const onSubmit = (e)=>{
    e.preventDefault();
    if(newAccount){

      // 회원가입
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setError(errorMessage);
        });
    }else{
      // 로그인
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
    }
  }
  console.log(email, password);
  const toggleAccount = () => setNewAccount(prev=>!prev);
  const googleSigin = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log(token, user);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        setError(errorMessage);
        console.log(errorCode, email, credential);
      });

  }

  return(
    <>
      <form onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Email 입력하세요" onChange={onChange} />
        <input type="password" name="password" placeholder="비밀번호를 입력하세요" onChange={onChange} />
        <p><button>{newAccount ? '회원가입': ' 로그인'}</button></p>
        {error}
      </form>
      <hr/>
      <button type="button" onClick={toggleAccount}>{newAccount ? '로그인으로 전환':'회원가입으로 전환'}</button>
      <hr/>
      <div>
        <button type="button" name="google" onClick={googleSigin}>구글로 회원가입</button>
      </div>
    </>
  )
}
export default Auth;