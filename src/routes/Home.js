import React, { useEffect, useState } from "react";
import {db} from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import Post from "../components/Post";

const Home = ({userObj})=> {
  console.log(userObj);
  const[post, setPost] = useState('');
  const[posts, setPosts] = useState([]);

  const onChange = (e) => {

    // let value = e.target.value(아래 문장과 같은말)
    const {target:{value}} = e;
    setPost(value);
  }


  // await 함수는 바로 못쓰기 때문에 async를 추가해줌
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        // title: post,
        content:post,
        date: serverTimestamp(),
        uid:userObj
      });
      setPost(''); //비우기
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  /*
  const getPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.data().post);
      const postObj = {
        ...doc.data(), //doc을 전부 풀어헤친 다음에
        id:doc.id //id를 출력
      }
      //prev를 풀어헤치고 거기에 postObj라는 객체를 배열의 한 값으로 추가
      setPosts(prev => [postObj, ...prev]) 
    });
  }
  console.log(posts);
  */

  useEffect(()=>{
    const q = query(collection(db, "posts"),orderBy('date', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      console.log(querySnapshot);
      const postArr = querySnapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }));
      setPosts(postArr);
    });
    // getPosts();
  }, []);
  
  return(
    <div>
      <form action="" onSubmit={onSubmit}>
        <input type="text" value={post} placeholder="Write your twitt" onChange={onChange} />
        <input type="submit" value="Add Post" />
      </form>
      <ul>{ posts.map(list =><Post key={list.id} postObj={list} isOwener={list.uid === userObj} />) }</ul>
    </div>
  )
}

export default Home;