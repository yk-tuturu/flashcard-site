import React, { useState } from 'react';
import CardPair from "./CardPair.jsx"
import '../styles/Cards.css'


function Edit() {
  const [cards, setCards] = useState([{front: "hello front", back: "hello back"}, {front: "hello front 2", back: "hello back 2"}]);

  function updateCardInfo(info) {
    const newCards = cards.map(function(card, index) {
      if (index === info.index) {
        return ({front: info.frontValue, back: info.backValue})
      }
      else {
        return card
      }
    })
    setCards(newCards)
  }

  function addCard(index) {
    const newCards = [
      ...cards.slice(0, index + 1), 
      {front: "", back: ""},
      ...cards.slice(index + 1)
    ]
    setCards(newCards)
    console.log("card added at index" + index)
    console.log(newCards)
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
            <button className= "saveButton">Save</button>
          </div>
          <div className="card-container">
            {cards.map(function(card, index) {
              return(
                <CardPair key= {index} index={index} frontValue={card.front} backValue={card.back} updateCardInfo={updateCardInfo} addCard={addCard}></CardPair>
              )
            })}
          </div>
        </div>
      </div>
               
    );
  }
  
  export default Edit;