import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from "axios"
import '../styles/View.css'
import { useLocation, useNavigate, useBlocker } from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import parse from "html-react-parser"
import {shuffleArray, isNumeric} from '../util.js'
import Flashcards from "./CardViewer.jsx"
import Memorize from "./Memorize.jsx"

function View() {
    // later will use to enable the author to link directly to edit page
    const {currentUser} = useContext(AuthContext)

    // tracks current card index and side (not sure if we need the side but oh well)
    const [currentCard, setCurrentCard] = useState(0)
    const [currentSide, setCurrentSide] = useState("front")
    const [cardIndex, setCardIndex] = useState(1)

    // for shuffling
    const [shuffle, setShuffle] = useState(false)
    const [ogCards, setOgCards] = useState([])

    const [bookmarked, setBookmarked] = useState(false)

    const [mode, setMode] = useState("flash")

    // info about flashcards, which would eventually include the title, author, tags, bookmarks, etc
    // right now it's just copied over from Edit.jsx
    const [info, setInfo] = useState({
        name: "",
        authorId: 0,
        authorName: "",
        subject: "",
        description: "",
        cards: [],
    });

    const mainRef = useRef(null)

    const location = useLocation()
    const id = location.pathname.split("/")[2]

    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await axios.get(`http://localhost:8800/api/cards/${id}`)
              console.log(res.data)
              
              // parses flashcard content, which was originally stored as a JSON string in the database
              const newCards = JSON.parse(res.data[0].flashcards)

              // keeps a record of the original order of cards, for when we would shuffle it later
              setOgCards(newCards)
              
              setInfo({
                name: res.data[0].name,
                authorId: res.data[0].user_id,
                authorName: res.data[0].username,
                subject: res.data[0].subject,
                description: res.data[0].description,
                cards: newCards
              })

              let bookmark;
              if (currentUser.id) {
                bookmark = await axios.get(`http://localhost:8800/api/users/bookmark/${currentUser.id}`)
              }

              console.log(bookmark)

              for (let index in bookmark.data) {
                console.log(bookmark.data[index].flashset_id)
                if (bookmark.data[index].flashset_id === parseInt(id)) {
                    console.log("we already bookmarked")
                    setBookmarked(true)
                    break
                }
              }
            }
            catch(err) {
              console.log(err)
            }
          };
        fetchData()
    }, [id, currentUser, setBookmarked])

    function flipCard(key = undefined) { 
        console.log(key)
        const map = mainRef.current.cards
        let cardToFlip;
        if (key === undefined) {
            cardToFlip = info.cards[currentCard]
        }
        else {
            for (let i in info.cards) {
                if (key === info.cards[i].key) {
                    console.log("found the card!!")
                    cardToFlip = info.cards[i]
                }
            }
        }
        console.log(cardToFlip)
        const node = map.get(cardToFlip)
        console.log(node)

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

    function moveRight(key = undefined) {
        // if at the end, return
        if (currentCard === info.cards.length - 1) {
            return
        }

        // gets the ref map
        const map = mainRef.current.cards
        let cardToFlip;
        if (key === undefined) {
            cardToFlip = info.cards[currentCard]
        }
        else {
            for (let i in info.cards) {
                if (key === info.cards[i].key) {
                    cardToFlip = info.cards[i]
                }
            }
        }
        const node = map.get(cardToFlip)

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

    function moveLeft() {
        if (currentCard === 0) {
            return
        }
        const map = mainRef.current.cards
        const node = map.get(info.cards[currentCard])
        node.className = node.className.replace(" active-card", "")
        node.className = node.className.replace(" flipped", "")
        setCurrentSide("front")

        setCurrentCard(currentCard => Math.max(currentCard - 1, 0))
    }

    // detects any changes in card index, and shifts the position accordingly
    useEffect(() => {
        if (!mainRef.current) {
            return;
        }
        mainRef.current.scroll.style.transform = `translateX(${-760 * (currentCard)}px)`

        // adds the active-card class to the newly active card
        const map = mainRef.current.cards
        const currentNode = map.get(info.cards[currentCard])

        if (currentNode && !currentNode.className.includes("active-card")) {
            currentNode.className += " active-card"
        }

        setCardIndex(currentCard + 1);
    }, [currentCard, currentSide, info, mainRef])

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
        const map = mainRef.current.cards
        for (let [card, node] of map) {
            node.className = node.className.replace(" active-card", "")
            node.className = node.className.replace(" flipped", "")
        }
    }

    const handleCardIndex = (e) => {
        setCardIndex((prev) => e.target.value);
        console.log(e.target.value)
        if (isNumeric(e.target.value)) {
            const targetIndex = parseInt(e.target.value)

            if (targetIndex > 0 && targetIndex <= info.cards.length) {
                setCurrentCard(targetIndex - 1);
            }

            else if (targetIndex <= 0) {
                setCurrentCard(0)
            }

            else if (targetIndex > info.cards.length) {
                setCurrentCard(info.cards.length - 1)
            }
        }
    }

    const saveProgress = async() => {
        if (!currentUser) {
            return
        }
        const cardData = mainRef.current.getSaveData()
        const data = {
            user_id: currentUser.id,
            flashset_id: id,
            cards: cardData
        }
        try {
            const res = await axios.post(`http://localhost:8800/api/progress/saveProgress`, data)
          }
          catch(err) {
            console.log(err)
          }
    }

    const resetAll = () => {
        console.log("reset called")
        setCurrentCard(0)
        setCurrentSide("front")
        setCardIndex(1)
        setShuffle(false)

        const map = mainRef.current.cards
        for (let [card, node] of map) {
            node.className = node.className.replace(" active-card", "")
            node.className = node.className.replace(" flipped", "")
        }
    }

    const changeTab = (tabName, event) => {
        if (tabName === "flashcards") {
            saveProgress()
            event.target.className = "tab-item-active"
            document.getElementById("memo").className = "tab-item"
            setMode("flash")
            resetAll()
        }
        else if (tabName === "memo") {
            event.preventDefault();
            event.target.className = "tab-item-active"
            document.getElementById("flash").className = "tab-item"
            setMode("memo")
            resetAll()
        }
    }

    const functions = {
        flipCard: flipCard,
        moveRight: moveRight,
        moveLeft: moveLeft,
        handleCardIndex: handleCardIndex,
        toggleShuffle: toggleShuffle,
        resetAll: resetAll
    }

    let blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
          mode === "memo" &&
          currentLocation.pathname !== nextLocation.pathname
      );
    
    const toggleBookmark = async() => {
        if (!currentUser) {
            return
        }

        const data = {
            user_id: currentUser.id,
            flashset_id: id
        }

        try {
            if (!bookmarked) {
                await axios.post(`http://localhost:8800/api/users/setBookmark`, data)
            }
            else {
                await axios.post(`http://localhost:8800/api/users/deleteBookmark`, data)
            }

            setBookmarked(!bookmarked)
            
          }
          catch(err) {
            console.log(err)
          }
    }


    return (
        <div>
            {blocker.state === "blocked" ? (
                <div className="on-nav-away">
                <p>Are you sure you want to leave? Your progress will be saved.</p>
                <button onClick={async() => {
                    await saveProgress()
                    blocker.proceed()}}>
                    Save my progress
                </button>
                <button onClick={() => blocker.reset()}>
                    No go back
                </button>
                </div>
            ) : null}
            <div className="viewHeader">
                <h1>{info.name}</h1>
                <div className='viewHeaderBottom'>
                    <p>By {info.authorName} on 23/5/2024</p>
                    <div>
                        {bookmarked === true ? (
                            <button onClick={toggleBookmark}>Bookmarked</button>
                        ) : (
                            <button onClick={toggleBookmark}>Bookmark</button>
                        )}
                        <button>Like</button>
                        { currentUser && currentUser.id === info.authorId ? (
                            <>
                                <button>Delete</button>
                                <button>Edit</button>
                            </>
                        ) : (<></>)}
                        
                    </div>
                    
                </div>
            </div>
            <div className="tab-bar">
                <button id="flash" className="tab-item-active" onClick={(event) => changeTab("flashcards", event)}>Flashcards</button>
                <button id="memo" className="tab-item" onClick={(event) => changeTab("memo", event)}>Memorize</button>
            </div>
            {mode === "flash" ? (
                <Flashcards cards={info.cards} currentCard={currentCard} cardIndex={cardIndex} ref={mainRef} functions={functions}></Flashcards>
            ) : (
                <Memorize flashset_id = {id} cards={info.cards} cardIndex={cardIndex} currentCard={currentCard} ref={mainRef} functions={functions}></Memorize>
            )}
            
            
            

        </div>
    )
}

export default View