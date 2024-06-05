import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import CardPair from "./CardPair.jsx"
import '../styles/Cards.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";

function Edit() {
  // to make sure we have perms to edit this
  const {currentUser, login} = useContext(AuthContext)

  // navigation
  const navigate = useNavigate()

  // stores all flashcard info, the cards are like an array within the object
  const [info, setInfo] = useState({
    name: "",
    subject: "",
    description: "",
    cards: [],
  });
  const [appended, setAppended] = useState(false)
  const cardsRef = useRef(null);

  function getMap() {
    if (!cardsRef.current) {
      cardsRef.current = new Map();
    }
    return cardsRef.current
  }

  // to know which flashset we are supposed to fetch, we read the url
  const location = useLocation()
  const id = location.pathname.split("/")[2]

  // fetches flashset
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/cards/${id}`)
        
        // if you're not the author, kicks you back to homepage
        // yeah prolly not the best way to implement this, can change this later
        if (res.data[0].user_id !== currentUser.id) {
          navigate("/")
        }
        
        // parses flashcard content, which was originally stored as a JSON string in the database
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

  // tabbing shenanigans
  useEffect(() => {
    const TabFunction = (event) => {
      if (event.key === "Tab") {
        const map = getMap()

        // loops through map to find the active element (yeah not the most efficient but oh well)
        for (let [card, node] of map) {
          if (node.contains(document.activeElement)) {
            // figures out whether we front or back
            const front = node.querySelector(".front")
            const back = node.querySelector(".back")
            
            // if in front, we just select the back, cool enough
            if (front.contains(document.activeElement)) {
              back.querySelector(".ql-editor").focus()
            }
            
            // if on the back, try to get the next card
            else if (back.contains(document.activeElement)) {
              const currentIndex = info.cards.indexOf(card) 

              // if we are at the end, add a new card, and set the appended flag to true. 
              // the appended flag will trigger the moving of focus later on
              if (currentIndex + 1 >= info.cards.length) {
                addCard(currentIndex)
                setAppended(true)
                return
              }
              
              // else, just get the next card
              const nextNode = map.get(info.cards[currentIndex + 1])
              nextNode.querySelector(".front").querySelector(".ql-editor").focus()
            }
            break;
          }
        }
      }
    }
    document.addEventListener("keydown", TabFunction, false);

    return () => {
      document.removeEventListener("keydown", TabFunction, false);
    };
  }, [info]);

  // the appended flag wil trigger this part here, where after the rendering of the new card, we will focus the new card
  useEffect(() => {
    if (appended) {
      const map = getMap();
      const nextNode = map.get(info.cards[info.cards.length - 1])
      nextNode.querySelector(".front").querySelector(".ql-editor").focus()
      setAppended(false)
    }
  }, [appended, info]);


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

  // saves flashset changes
  const saveFlashSet = async(e) => {
    e.preventDefault()
    try{
        await axios.post(`http://localhost:8800/api/cards/update/${id}`, info)
    }catch(err){
        console.log(err)
    }
  };

  // keeps track of value of the name, subject and desc fields
  const handleInfoChange = (e) => {
    setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  // these functions will be fed to cardpair
  const functions = {
    updateCardInfo: updateCardInfo,
    addCard: addCard,
    deleteCard: deleteCard,
    moveUp: moveUp,
    moveDown: moveDown,
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
              <CardPair key= {card.key} index={index} frontValue={card.front} backValue={card.back} functions={functions} ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(card, node);
                } else {
                  map.delete(card)
                }
              }}></CardPair>
            )
          })}
        </div>
      </div>
    </div>      
  );
}

export default Edit;