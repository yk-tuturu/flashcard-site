import React, { useState, useEffect } from 'react';
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import CardPair from "./CardPair.jsx"
import '../styles/Cards.css'


function Edit() {
  const [cards, setCards] = useState([]);

  const id = 1

  // grabs existing flashset info, we hardcoded the id for now, will change later
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data")
        const res = await axios.get(`http://localhost:8800/api/cards/${id}`)
        const newCards = res.data.map(function(card, index) {
          return({key: uuidv4(), front: card.front, back: card.back})
        }) 
        setCards(newCards)
      }
      catch(err) {
        console.log(err)
      }
    };
    fetchData()
  }, [id])

  // a bunch of functions for adding and deleting and moving cards
  function updateCardInfo(info) {
    const newCards = cards.map(function(card, index) {
      if (index === info.index) {
        return ({key: card.key, front: info.frontValue, back: info.backValue})
      }
      else {
        return card
      }
    })
    setCards(newCards)
    console.log(newCards)
  }

  function addCard(index) {
    const newCards = [
      ...cards.slice(0, index + 1), 
      {key: uuidv4(), front: "", back: ""},
      ...cards.slice(index + 1)
    ]
    setCards(newCards)
    console.log("card added at index" + index)
    console.log(newCards)
  }

  function deleteCard(index) {
    console.log(index)
    if (cards.length <= 1) return
    const newCards = [
      ...cards.slice(0, index),
      ...cards.slice(index + 1)
    ]
    setCards(newCards)
    console.log(newCards)
  }

  function moveUp(index) {
    if (index === 0) return

    const newCards = [...cards];

    [newCards[index - 1], newCards[index]] = [newCards[index], newCards[index - 1]]
    setCards(newCards)
  }

  function moveDown(index) {
    if (index === cards.length - 1) return

    const newCards = [...cards];

    [newCards[index + 1], newCards[index]] = [newCards[index], newCards[index + 1]]
    setCards(newCards)
  }

  const saveFlashSet = async(e) => {
    e.preventDefault()
    try{
        await axios.post(`http://localhost:8800/api/cards/update/${id}`, cards)
    }catch(err){
        console.log(err)
    }
};

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
                <input type="text" placeholder="Flashset Name" name="deckName" className="card-input"></input>
                <p>Subject</p>
                <input type="text" placeholder="Subject" name="deckSubject" className="card-input"></input>
              </div>
              <div>
                <p>Description</p>
                <textarea className="card-input" name="deckDescription" rows="4" cols="50"></textarea>
              </div>
          </div>
      </div>
      <div className="edit-info edit-cards">
        <div className="edit-heading">
          Edit Flashcard Deck
          <button className= "saveButton" onClick={saveFlashSet}>Save</button>
        </div>
        <div className="card-container">
          {cards.map(function(card, index) {
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