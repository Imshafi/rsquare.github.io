import styles from "./styles.module.css";
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react';

import axios from 'axios'

const Main = () => {
  const [image,setImage] = useState("");
  const user = localStorage.getItem("token");
  const [images,setImages] = useState([]);
  const [noImages,setNoImages] = useState([]);
  useEffect(()=>{
		axios.post("http://localhost:8000/api/get",{token:user}).then(res=>{
      if( res.data.images === '' ){
        setNoImages(res.data.message)
      }else{
        setImages(res.data.images);
      }
		}).catch(err=>{
			console.log(err)
		})
	},)
  
    async function postFile(e){
      e.preventDefault();
      try {
        const formData = new FormData()
        formData.append('image',image);
        formData.append('token',user);
        axios.post('http://localhost:8000/api/upload',formData).then((res)=>{
          window.location.reload();
        })
      } catch (error) {
        console.log(error);
      }
    }
    
    function handleChange(e){
      setImage(e.target.files[0]);
    }

    let showImages = images.map((src,i)=>{
      return <div className={styles.cards}><div className={styles.card}><img className={styles.cardImage} src={"http://localhost:8000/img/"+src} alt={src} key={i}/> </div></div>
    })

	return (
		    <div className={styles.mainContainer}>
          <div className={styles.smallContainer}>
        <div>
            <h4>Media Library</h4>
        </div>
        <div>
            <form onSubmit={postFile}>
              <label for="file" >
                <AiOutlinePlusCircle /> &nbsp;
              Upload Image</label>
              <input type="file" name="file" id="file" value={image.file} multiple onChange={handleChange}/>
              <button type="submit" className={styles.logout}>Submit</button> 
            </form>
          </div>
        </div>
        <div className={styles.bigContainer}>
          {
            showImages
          }
        <div>{noImages}</div>
        </div>
        <div className={styles.buttonClass}>
          <Link to="/signup">
                <button className={styles.logout}>Logout</button>
          </Link>
            </div>
        </div>
        
	);
};
export default Main;