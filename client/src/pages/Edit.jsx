import React, { useState, useEffect, useContext } from 'react';
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import CardPair from "./CardPair.jsx"
import '../styles/Cards.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";


function Edit() {
  const {currentUser, login} = useContext(AuthContext)
  const navigate = useNavigate()

  const [info, setInfo] = useState({
    name: "",
    subject: "",
    description: "",
    cards: [],
  });

  const location = useLocation()
  const id = location.pathname.split("/")[2]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/cards/${id}`)

        if (res.data[0].user_id !== currentUser.id) {
          navigate("/")
        }

        const newCards = JSON.parse(res.data[0].flashcards)
        console.log(newCards)
        
        setInfo({
          name: res.data[0].name,
          subject: res.data[0].subject,
          description: res.data[0].description,
          cards: newCards
        })
      }
      catch(err) {
        console.log(err)
      }
    };
    fetchData()
  }, [id])

  // a bunch of functions for adding and deleting and moving cards
  function updateCardInfo(data) {
    const newCards = info.cards.map(function(card, index) {
      if (index === data.index) {
        return ({key: card.key, front: data.frontValue, back: data.backValue})
      }
      else {
        return card
      }
    })
    setInfo({...info, cards: newCards})
    console.log(info)
  }

  function addCard(index) {
    const newCards = [
      ...info.cards.slice(0, index + 1), 
      {key: uuidv4(), front: "", back: ""},
      ...info.cards.slice(index + 1)
    ]
    setInfo({...info, cards: newCards})
    console.log("card added at index" + index)
  }

  function deleteCard(index) {
    console.log(index)
    if (info.cards.length <= 1) return
    const newCards = [
      ...info.cards.slice(0, index),
      ...info.cards.slice(index + 1)
    ]
    setInfo({...info, cards: newCards})
  }

  function moveUp(index) {
    if (index === 0) return

    const newCards = [...info.cards];

    [newCards[index - 1], newCards[index]] = [newCards[index], newCards[index - 1]]
    setInfo({...info, cards: newCards})
  }

  function moveDown(index) {
    if (index === info.cards.length - 1) return

    const newCards = [...info.cards];

    [newCards[index + 1], newCards[index]] = [newCards[index], newCards[index + 1]]
    setInfo({...info, cards: newCards})
  }

  const saveFlashSet = async(e) => {
    e.preventDefault()
    try{
        await axios.post(`http://localhost:8800/api/cards/update/${id}`, info)
    }catch(err){
        console.log(err)
    }
};

const handleInfoChange = (e) => {
  setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
}

  const functions = {
    updateCardInfo: updateCardInfo,
    addCard: addCard,
    deleteCard: deleteCard,
    moveUp: moveUp,
    moveDown: moveDown
  }

  return (
    <div className="content">
      <div className="edit-info nav-space">
          <div className="edit-heading">Edit Flashcard Info</div>
          <div className="edit-content">
              <div>
                <p>Set title</p>
                <input type="text" placeholder="Flashset Name" name="name" className="card-input" value={info.name} onChange={handleInfoChange}></input>
                <p>Subject</p>
                <input type="text" placeholder="Subject" name="subject" className="card-input" value={info.subject} onChange={handleInfoChange}></input>
              </div>
              <div>
                <p>Description</p>
                <textarea className="card-input" name="description" rows="4" cols="50" value={info.description} onChange={handleInfoChange}></textarea>
              </div>
          </div>
      </div>
      <div className="edit-info edit-cards">
        <div className="edit-heading">
          Edit Flashcard Deck
          <button className= "saveButton" onClick={saveFlashSet}>Save</button>
        </div>
        <div className="card-container">
          {info.cards.map(function(card, index) {
            return(
              <CardPair key= {card.key} index={index} frontValue={card.front} backValue={card.back} functions={functions}></CardPair>
            )
          })}
        </div>
      </div>
    </div>      
  );
}
  
  export default Edit;