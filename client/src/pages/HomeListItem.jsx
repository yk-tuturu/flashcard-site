import React from "react"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom"

function HomeListItem(props) {
    const navigate = useNavigate()

    function handleClick() {
        navigate(`/edit/${props.deckID}`)
    }
    return (
        
        <div className="home-list-item" onClick={handleClick}>
            <div className="home-list-left">
                <h2>Interview</h2>
                <p className="author">Author: Tuturu</p>
                <p>Subject: CS</p>
                <p>Views: 69  Bookmark: 1</p>
                </div>
                <div className="home-list-right">
            <div className="flash-logo-container">
                <div><img src="flashcard_logo.png" alt="flashcard"></img></div>
                <div> <h1>:19</h1></div>
            </div>
            <p>Tags: test, 1, 2, 3</p>
            </div>
        </div>
    )
}

export default HomeListItem