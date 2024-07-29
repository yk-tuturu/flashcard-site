import React from "react"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom"

function HomeListItem({info}) {
    const navigate = useNavigate()

    function handleClick() {
        navigate(`/view/${info.id}`)
    }
    return (
        
        <div className="home-list-item" onClick={handleClick}>
            <div className="home-list-left">
                <h2>{info.name}</h2>
                <p className="author">Author: {info.author}</p>
                <p>Subject: {info.subject}</p>
                <span style={{marginRight: "16px"}}>Likes: {info.likes} </span> <span>Bookmark: {info.bookmarks}</span>
                </div>
                <div className="home-list-right">
            <div className="flash-logo-container">
                <div><img src="flashcard_logo.png" alt="flashcard"></img></div>
                <div> <h1>:{info.length}</h1></div>
            </div>
            <p>Tags: test, 1, 2, 3</p>
            </div>
        </div>
    )
}

export default HomeListItem