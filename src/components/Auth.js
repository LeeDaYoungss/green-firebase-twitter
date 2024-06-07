import React, { useState } from "react";
import { authService } from "../firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const Auth = ()=> {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[newAccount, setNewAccount] = useState(true);
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
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
        });
    }else{
      // 로그인
    }
  }
  console.log(email, password);

  return(
    <form onSubmit={onSubmit}>
      <input type="email" name="email" placeholder="Email 입력하세요" onChange={onChange} />
      <input type="password" name="password" placeholder="비밀번호를 입력하세요" onChange={onChange} />
      <p><button>{newAccount ? '회원가입': ' 로그인'}로그인</button></p>
    </form>
  )
}
export default Auth;