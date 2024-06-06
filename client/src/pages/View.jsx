import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from "axios"
import '../styles/View.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import parse from "html-react-parser"

function View() {
    // later will use to enable the author to link directly to edit page
    const {currentUser} = useContext(AuthContext)

    // tracks current card index and side (not sure if we need the side but oh well)
    const [currentCard, setCurrentCard] = useState(0)
    const [currentSide, setCurrentSide] = useState("front")

    // for shuffling
    const [shuffle, setShuffle] = useState(false)
    const [ogCards, setOgCards] = useState([])

    // info about flashcards, which would eventually include the title, author, tags, bookmarks, etc
    // right now it's just copied over from Edit.jsx
    const [info, setInfo] = useState({
        name: "",
        subject: "",
        description: "",
        cards: [],
    });

    // ref for the whole card container
    const scrollRef = useRef(null)

    // ref to each individual card
    const cardsRef = useRef(null)

    function getMap() {
        if (!cardsRef.current) {
          cardsRef.current = new Map();
        }
        return cardsRef.current
    }

    // gets id and fetches corresponding card set
    const location = useLocation()
    const id = location.pathname.split("/")[2]

    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await axios.get(`http://localhost:8800/api/cards/${id}`)
              
              // parses flashcard content, which was originally stored as a JSON string in the database
              const newCards = JSON.parse(res.data[0].flashcards)

              // keeps a record of the original order of cards, for when we would shuffle it later
              setOgCards(newCards)
              
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

    // flips the card when down arrow pressed
    useEffect(() => {
        const DownFunction = (event) => { 
          if (event.key === "ArrowDown" || event.key === " ") {
            event.preventDefault() 
            const map = getMap()
            const node = map.get(info.cards[currentCard])

            // adds/removes the flipped class to toggle the flipping
            if (currentSide === "front") {
                node.className += " flipped"
                setCurrentSide("back")
            }
            else if (currentSide === "back") {
                node.className = node.className.replace(" flipped", "")
                setCurrentSide("front")
            }
          }
        }
        document.addEventListener("keydown", DownFunction, false);
    
        return () => {
          document.removeEventListener("keydown", DownFunction, false);
        };
      }, [cardsRef, currentCard, info, currentSide]);
    
    // shifts one card to the right 
    useEffect(() => {
        const RightFunction = (event) => {
          if (event.key === "ArrowRight") {
            // if at the end, return
            if (currentCard === info.cards.length - 1) {
                return
            }

            // gets the ref map
            const map = getMap()
            const node = map.get(info.cards[currentCard])

            // removes the active card class and unflips the card
            node.className = node.className.replace(" active-card", "")
            node.className = node.className.replace(" flipped", "")

            // also scrolls any scrollables back to top and unfocuses
            for (const child of node.children) {
                child.scrollTop = 0
            }
            document.activeElement.blur()

            setCurrentSide("front")
            
            // we only set the index here, the actual moving will take place in another useEffect
            setCurrentCard(currentCard => Math.min(currentCard + 1, info.cards.length - 1))
          }
        }
        document.addEventListener("keydown", RightFunction, false);
    
        return () => {
          document.removeEventListener("keydown", RightFunction, false);
        };
      }, [scrollRef, currentCard, currentSide, info]);
    
    // same thing but for moving to the left
    useEffect(() => {
    const LeftFunction = (event) => {
        if (event.key === "ArrowLeft") {
            if (currentCard === 0) {
                return
            }
            const map = getMap()
            const node = map.get(info.cards[currentCard])
            node.className = node.className.replace(" active-card", "")
            node.className = node.className.replace(" flipped", "")
            setCurrentSide("front")

            setCurrentCard(currentCard => Math.max(currentCard - 1, 0))
        }
    }
    document.addEventListener("keydown", LeftFunction, false);

    return () => {
        document.removeEventListener("keydown", LeftFunction, false);
    };
    }, [scrollRef, currentCard, currentSide, info]);

    // detects any changes in card index, and shifts the position accordingly
    useEffect(() => {
        scrollRef.current.style.transform = `translateX(${-760 * (currentCard)}px)`

        // adds the active-card class to the newly active card
        const map = getMap()
        const currentNode = map.get(info.cards[currentCard])
        console.log()
        if (currentNode && !currentNode.className.includes("active-card")) {
            currentNode.className += " active-card"
        }
    }, [scrollRef, currentCard, currentSide, info])

    
    // utility function for shuffling an array
    function shuffleArray(array) {
        let currentIndex = array.length;
      
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array
    }

    // handles shuffling of the cards
    const toggleShuffle = (e) => {
        // sets the shuffle value
        const newValue = !shuffle
        setShuffle(newValue)

        // if true, shuffle cards
        if (newValue) {
            const oldCards = info.cards.slice()
            const shuffledCards = shuffleArray(oldCards)
            setInfo((prev) => ({...prev, cards: shuffledCards}));
        }

        // else, replace the shuffled array with the original
        else {
            console.log(ogCards)
            setInfo((prev) => ({...prev, cards: ogCards}))
        }

        // removes the active class from all cards so that it can be reset
        const map = getMap()
        for (let [card, node] of map) {
            node.className = node.className.replace(" active-card", "")
            node.className = node.className.replace(" flipped", "")
        }
    }

    return (
        <div>
            <div className="viewHeader">
                <h1>{info.name}</h1>
                <div className='viewHeaderBottom'>
                    <p>By Tuturu on 23/5/2024</p>
                    <button>Like</button>
                    <button>Bookmark</button>
                </div>
            </div>
            <div className="cardViewer">
                <div className="cardContainer" ref={scrollRef}>
                    {info.cards.map(function(card, index) {
                        return(
                            <div key={card.key} className="card flip-card">
                                <div className="flip-card-inner" ref={(node) => {
                                    const map = getMap();
                                    if (node) {
                                    map.set(card, node);
                                    } else {
                                    map.delete(card);
                                    }
                                }}>
                                    <div className="flip-card-front">
                                        {parse(card.front)}
                                    </div>
                                    <div className="flip-card-back">
                                        {parse(card.back)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='shuffle'>
                <label>Shuffle
                    <input type="checkbox" onChange={toggleShuffle}></input>
                    <span className="checkmark"></span>
                </label>
            </div>
            

        </div>
    )
}

export default View