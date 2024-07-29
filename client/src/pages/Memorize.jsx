import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef, useContext} from "react"
import parse from "html-react-parser"
import {shuffleArray, isNumeric} from '../util.js'
import "../styles/View.css"
import axios from "axios"
import { AuthContext } from "../context/authContext.js"

const Memorize = (props, ref) => {
    const [cards, setCards] = useState([])
    const [saveData, setSaveData] = useState([])
    const [flipped, setFlipped] = useState(false)

    const {currentUser} = useContext(AuthContext)

    const [menuState, setMenuState] = useState(true) 

    // ref for the whole card container
    const scrollRef = useRef(null)

    // ref to each individual card
    const cardsRef = useRef(new Map())

    // ref to the start menu screen
    const startRef = useRef(null)

    // ref to the start menu screen
    const finishRef = useRef(null)

    useImperativeHandle(ref, () => ({
        getSaveData() {
            return saveData
        },
        get scroll() {
            return scrollRef.current;
        },
        get cards() {
            return cardsRef.current;
        },
    }));

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser.id) {
                startRef.current.style.display = "none"
                return
            }

            try {
              const res = await axios.get(`http://localhost:8800/api/progress/getFlashProgress`, {
                params: {
                    user_id: currentUser.id,
                    flashset_id: props.flashset_id
                }
              })

              let newSaveData = []
              if (res.data.length !== 0) {
                newSaveData = JSON.parse(res.data[0].cards)

                // if save data is same length, means we prolly already finished all in a previous round, 
                // so begin with empty array
                if (newSaveData.length === props.cards.length) {
                    newSaveData = []
                }

                setSaveData(newSaveData)
              }
              
              setCards(props.cards.map(function(card, index) {
                    if (!newSaveData.includes(card.key)){
                        return card
                    }
                }).filter(function(element) {
                    return element !== undefined
                }))
            }
            catch(err) {
              console.log(err)
            }
          };
        fetchData()
    }, [currentUser, props.flashset_id, startRef])


    const CorrectFunction = (event) => {
        event.preventDefault()

        if (menuState || !flipped) {return}

        setFlipped(false)

        // writes to save data that we got this card correct
        if (!saveData.includes(cards[props.currentCard].key)) {
            setSaveData([...saveData, cards[props.currentCard].key])
        }

        if (props.currentCard >= cards.length - 1) {
            // loop back to menu state once we reach here
            let newSaveData = [...saveData, cards[props.currentCard].key]

            if (newSaveData.length === props.cards.length) {
                newSaveData = []
                setSaveData([])
                enableFinishMenu()
            }
            else {
                enableMenu()
            }

            props.functions.resetAll()
            setCards(props.cards.map(function(card, index) {
                if (!newSaveData.includes(card.key)){
                    return card
                }
            }).filter(function(element) {
                return element !== undefined
            }))
            return
        }
        
        props.functions.moveRight(cards[props.currentCard].key)
    }

    const WrongFunction = (event) => {
        event.preventDefault()

        if (menuState || !flipped || props.currentCard >= cards.length - 1) {return}

        if (props.currentCard >= cards.length - 1) {
            // loop back to menu state once we reach here
        }
    
        setFlipped(false)
        props.functions.moveRight(cards[props.currentCard].key)
    }

    const FlipFunction = (event) => {
        if (menuState) {return}

        console.log(cards)

        event.preventDefault()
        if (!flipped) {
            setFlipped(true)
        }

        props.functions.flipCard(cards[props.currentCard].key)
    }

    useEffect(() => {
        const buttonDown = (event) => {
            if (menuState) {return}
            if (event.key === "r") {
                CorrectFunction(event)
            }

            if (event.key === "w") {
                WrongFunction(event)
            }

            if (event.key === "ArrowDown" || event.key===" ") {
                FlipFunction(event)
            }
        }
        document.addEventListener("keydown", buttonDown, false);

        return () => {
            document.removeEventListener("keydown", buttonDown, false);
        };
    }, [props.functions, menuState, props.currentCard, cards])

    function disableMenu() {
        startRef.current.style.display = "none"
        finishRef.current.style.display = "none"
        scrollRef.current.style.display = "block"
        setMenuState(false)
    }

    function enableMenu() {
        startRef.current.style.display = "block"
        scrollRef.current.style.display = "none"
        setMenuState(true)
    }

    function enableFinishMenu() {
        finishRef.current.style.display = "block"
        scrollRef.current.style.display = "none"
        setMenuState(true)
    }

    return(
        <div className="cardViewer" style={{marginBottom: "30px"}}>
            {!currentUser.id ? (
                <div className="startScreen">
                    <h3>Log in <a href="/login">here</a> to access this feature!</h3>
                </div>
            ) : null}
            <div className="startScreen" ref={startRef}>
                <p>Cram everything you need to know in one sitting!</p>
                <p>You have <b>{cards.length}</b> of <b>{props.cards.length}</b> cards remaining</p>
                <p>Click on the Yes and No buttons to indicate if you've remembered the card</p>
                <p>Shortcuts: ArrowDown/Space to flip, R for Right, W for Wrong</p>
                <button onClick={disableMenu}>Start Memorizing Now!</button>
            </div>

            <div className="startScreen hidden" ref={finishRef}>
                <p>You have memorized all the cards!!</p>
                <p>Do you wish to go again?</p>
                <button onClick={disableMenu}>Begin new round</button>
            </div>
            
            <div className="cardContainer hidden" ref={scrollRef}>
                {cards.map(function(card, index) {
                    return(
                        <div key={card.key} className="card flip-card">
                            <div className="flip-card-inner" ref={(node) => {
                                const map = cardsRef.current;
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
            {flipped ? (
                <div className="cardNumber">
                    <span><button onClick={CorrectFunction}>Yes I rememeber</button><button onClick={WrongFunction}>No, I forgor</button></span>
                </div>
            ) : (
                <div className="cardNumber">
                    <span><button onClick={FlipFunction}>Flip to the back</button></span>
                </div>
            )}
            
        </div>
    )
}

export default forwardRef(Memorize)