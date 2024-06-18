import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react"
import parse from "html-react-parser"
import {shuffleArray, isNumeric} from '../util.js'
import "../styles/View.css"

const Flashcards = forwardRef((props, ref) => {
    const cards = props.cards;

    // ref for the whole card container
    const scrollRef = useRef(null)

    // ref to each individual card
    const cardsRef = useRef(new Map())

    useImperativeHandle(ref, () => ({
        get scroll() {
            return scrollRef.current;
        },
        get cards() {
            return cardsRef.current;
        },
      }));

    useEffect(() => {
        const ButtonDown = (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault()
                props.functions.moveRight()
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault()
                props.functions.moveLeft()
            }

            if (event.key === "ArrowDown") {
                event.preventDefault()
                props.functions.flipCard()
            }

        }
        document.addEventListener("keydown", ButtonDown, false);

        return () => {
            document.removeEventListener("keydown", ButtonDown, false);
        };
    }, [props.functions])

    return(
        <>
            <div className="cardViewer">
                <div className="cardContainer" ref={scrollRef}>
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
            <div className='shuffle'>
                <label>Shuffle
                    <input type="checkbox" onChange={props.functions.toggleShuffle}></input>
                    <span className="checkmark"></span>
                </label>
            </div>
        </>
    )
})

export default Flashcards;