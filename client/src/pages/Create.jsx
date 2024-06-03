import axios from "axios";
import '../styles/Cards.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext";;

function Create() {
    const {currentUser, login} = useContext(AuthContext)

    const [info, setInfo] = useState({
        name: "",
        subject: "",
        description: "",
        user_id: currentUser.id,
    });

    const navigate = useNavigate()
  
    const createFlashSet = async(e) => {
      e.preventDefault()
      try{
          await axios.post(`http://localhost:8800/api/cards/create`, info).then((res)=>{
            navigate(`/edit/${res.data.id}`)
          })
          
      }catch(err){
          console.log(err)
      }
    };

    const handleChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
        console.log(info)
    }
  
    return (
      <div className="content">
        <div className="edit-info nav-space">
            <div className="edit-heading">Create New Flashcard Set</div>
            <div className="edit-content">
                <div>
                  <p>Set title</p>
                  <input type="text" placeholder="Flashset Name" name="name" className="card-input" onChange={handleChange}></input>
                  <p>Subject</p>
                  <input type="text" placeholder="Subject" name="subject" className="card-input" onChange={handleChange}></input>
                </div>
                <div>
                  <p>Description</p>
                  <textarea className="card-input" name="description" rows="4" cols="50" onChange={handleChange}></textarea>
                </div>
            </div>
        </div>
        <button className="createButton" onClick={createFlashSet}>Create</button>
      </div>      
    );
  }
    
    export default Create;