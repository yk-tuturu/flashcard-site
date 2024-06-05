import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
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

    const [info, setInfo] = useState({
        name: "",
        subject: "",
        description: "",
        cards: [],
    });

    const scrollRef = useRef(null)
    const cardsRef = useRef(null)

    function getMap() {
        if (!cardsRef.current) {
          cardsRef.current = new Map();
        }
        return cardsRef.current
    }
    const id = 7

    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await axios.get(`http://localhost:8800/api/cards/${id}`)
              
              // parses flashcard content, which was originally stored as a JSON string in the database
              const newCards = JSON.parse(res.data[0].flashcards)
              
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

    useEffect(() => {
        const DownFunction = (event) => {
          if (event.key === "ArrowDown") {
            const map = getMap()
            const node = map.get(info.cards[currentCard])
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

    useEffect(() => {
        const RightFunction = (event) => {
          if (event.key === "ArrowRight") {
            if (currentCard === info.cards.length - 1) {
                return
            }
            const map = getMap()
            const node = map.get(info.cards[currentCard])
            node.className = node.className.replace(" active-card", "")
            node.className = node.className.replace(" flipped", "")
            setCurrentSide("front")

            setCurrentCard(currentCard => Math.min(currentCard + 1, info.cards.length - 1))
          }
        }
        document.addEventListener("keydown", RightFunction, false);
    
        return () => {
          document.removeEventListener("keydown", RightFunction, false);
        };
      }, [scrollRef, currentCard, currentSide, info]);

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

    useEffect(() => {
        scrollRef.current.style.transform = `translateX(${-760 * (currentCard)}px)`
        const map = getMap()
        const currentNode = map.get(info.cards[currentCard])
        console.log()
        if (currentNode && !currentNode.className.includes("active-card")) {
            currentNode.className += " active-card"
            
        }
    }, [scrollRef, currentCard, currentSide, info.cards])

    return (
        <div>
            <div className="viewHeader">
                <h1>Title</h1>
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
            

        </div>
    )
}

export default View