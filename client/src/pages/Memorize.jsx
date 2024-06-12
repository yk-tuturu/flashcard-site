import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react"
import parse from "html-react-parser"
import {shuffleArray, isNumeric} from '../util.js'
import "../styles/View.css"

const Memorize = (props, ref) => {
    const cards = props.cards;
    const [menuState, setMenuState] = useState(true) 

    // ref for the whole card container
    const scrollRef = useRef(null)

    // ref to each individual card
    const cardsRef = useRef(new Map())

    const startRef = useRef(null)

    useImperativeHandle(ref, () => ({
        get scroll() {
            return scrollRef.current;
        },
        get cards() {
            return cardsRef.current;
        },
    }));

    useEffect(() => {
        const RightFunction = (event) => {
            if (menuState) {return}
            if (event.key === "ArrowRight") {
                event.preventDefault()
                props.functions.moveRight()
            }
        }
        document.addEventListener("keydown", RightFunction, false);

        return () => {
            document.removeEventListener("keydown", RightFunction, false);
        };
    }, [props.functions, menuState])

    useEffect(() => {
        const LeftFunction = (event) => {
            if (menuState) {return}

            if (event.key === "ArrowLeft") {
                event.preventDefault()
                props.functions.moveLeft()
            }
        }
        document.addEventListener("keydown", LeftFunction, false);

        return () => {
            document.removeEventListener("keydown", LeftFunction, false);
        };
    }, [props.functions, menuState])

    useEffect(() => {
        const DownFunction = (event) => {
            if (menuState) {return}

            if (event.key === "ArrowDown") {
                event.preventDefault()
                props.functions.flipCard()
            }
        }
        document.addEventListener("keydown", DownFunction, false);

        return () => {
            document.removeEventListener("keydown", DownFunction, false);
        };
    }, [props.functions, menuState])

    function disableMenu() {
        startRef.current.style.display = "none"
        scrollRef.current.style.display = "block"
        setMenuState(false)
    }

    return(
        <div className="cardViewer">
            <div className="startScreen" ref={startRef}>
                <p>Cram everything you need to know in one sitting!</p>
                <p>You have <b>{cards.length}</b> of <b>{cards.length}</b> cards remaining</p>
                <p>Click on the Yes and No buttons to indicate if you've remembered the card</p>
                <p>Shortcuts: ArrowDown/Space to flip, R for Right, W for Wrong</p>
                <button onClick={disableMenu}>Start Memorizing Now!</button>
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
            <div className="cardNumber">
                <span><input value={props.cardIndex} onChange={props.functions.handleCardIndex}></input></span> of {cards.length}
            </div>
        </div>
    )
}

export default forwardRef(Memorize)