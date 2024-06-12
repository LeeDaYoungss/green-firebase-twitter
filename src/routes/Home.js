import React, { useEffect, useState } from "react";
import {db} from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, onSnapshot, query, orderBy } from "firebase/firestore"; 
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import Post from "../components/Post";

const Home = ({userObj}) => {
  const storage = getStorage();
  const storageRef = ref(storage);

  console.log(userObj);
  const[post, setPost] = useState('');
  const[posts, setPosts] = useState([]); 
  const[attachment, setAttachment] = useState();
  let attachmentUrl = '';

  const onChange = (e) =>{
    //let value = e.target.value
    const {target:{value}} = e;
    setPost(value);
  }
  const onSubmit = async (e) =>{
    e.preventDefault();
    const inputFile = document.querySelector('#file');

    const fileRef = ref(storage, `${userObj}/${uuidv4()}}`);
    
    const addPost = async()=>{
      await addDoc(collection(db, "posts"), {
        content:post,
        date:serverTimestamp(),
        uid:userObj,
        attachmentUrl
      });
      setPost(''); //글 삭제
      setAttachment(''); //미리보기 이미지 삭제
      inputFile.value = '';
    }
    try {
      if (inputFile.value){
        uploadString(fileRef, attachment, 'data_url').then(async(snapshot) => {
          attachmentUrl = await getDownloadURL(fileRef);
          addPost();
        });
      }else{
        addPost();
      }
    }catch (e) {
      alert("글 등록 실패: ", e);
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
    const q = query(collection(db, "posts"),orderBy('date','desc'));
    onSnapshot(q, (querySnapshot) => {  
      const postArr = querySnapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }));      
      setPosts(postArr);
    });

    //getPosts();
  },[]);

  const onFileChange = (e) =>{
    //console.log(e.target.files);
    const {target:{files}} = e;
    const theFile = files[0];
    //console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (e) =>{
      console.log(e.target.result);
      const {target:{result}} = e;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }
  const onClearFile = ()=>{
    setAttachment(null);
    document.querySelector('#file').value='';
  }
  return(
    <div>
      <form action="" onSubmit={onSubmit}>
        <input type="text" value={post} placeholder="Write your twitt" onChange={onChange} required />
        <input type="file" accept="image/*" onChange={onFileChange} id="file"/>
        {
        attachment && 
        <>
          <img src={attachment} width="50" alt=""/>        
          <button type="button" onClick={onClearFile}>파일 업로드 취소</button>
        </>
        }
        <p>
          <input type="submit" value="Add Post"/>
        </p>
      </form>
      <hr/>
      <ul>
        {
          posts.map(list =><Post key={list.id} postObj={list} isOwener={list.uid === userObj}/>)
        }
      </ul>
    </div>
  )
}

export default Home;