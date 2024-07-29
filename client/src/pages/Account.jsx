import axios from "axios";
import '../styles/Account.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/authContext";
import {v4 as uuidv4} from "uuid";

function Account() {
    const {currentUser} = useContext(AuthContext)
    const [userSets, setUserSets] = useState([])
    const [bookmarkSets, setBookmarkSets] = useState([])
    const [expanded, setExpanded] = useState(false)
    const [expandedB, setExpandedB] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser.id) {
                navigate("/login")
                return
            }

            try {
              const res = await axios.get(`http://localhost:8800/api/cards/user/${currentUser.id}`)

              var newUserSets = []

              for (var i in res.data) {
                const bookmarkCount = await axios.get(`http://localhost:8800/api/cards/bookmarkCount/${res.data[i].id}`)
                const current = res.data[i]
                newUserSets.push({id: current.id, name: current.name, subject: current.subject})
                setUserSets(newUserSets)
              }

              const bookmark_res = await axios.get(`http://localhost:8800/api/users/bookmark/${currentUser.id}`)
              
              var newBookmarkSets = []
              for (var j in bookmark_res.data) {
                var current = bookmark_res.data[j]
                const bookmarkCount = await axios.get(`http://localhost:8800/api/cards/bookmarkCount/${current.flashset_id}`)
                console.log(bookmarkCount.data[0]["COUNT(*)"])
                newBookmarkSets.push({id: current.flashset_id, name: current.name, subject: current.subject, bookmarks: bookmarkCount.data[0]["COUNT(*)"]})
                setBookmarkSets(newBookmarkSets)
              }
              
              
            }
            catch(err) {
              console.log(err)
            }
          };
        fetchData()
    }, [])

    return (
        <div className="account-parent">
            <div className="account-info">
                <img src="account.png" alt="account logo"></img>
                <p className="username">{currentUser.username}</p>
                <div style={{paddingTop: "40px"}}></div>
                <p className="small-text">Joined: xxx date</p>
                <p className="small-text">Follows: 0</p>
                <p className="small-text">Account settings</p>
            </div>
            <div className="flashcardParent">
                <div className="my-flashcards-container">
                    <h3 className="align-left">My Flashcards</h3>
                    {userSets.map(function(cardSet, index) {
                        if (index >= 3 && !expanded) {
                            return;
                        }
                        return(
                            <div className="flashcard-item" key={uuidv4()}>
                                <div className="center-parent">
                                    <img src="flashcard_logo.png" alt="flashcard logo" className="center"></img>
                                </div>
                                <div className="align-left">
                                    <h2>{cardSet.name}</h2>
                                    <p className="flashcard-item-text">Subject: {cardSet.subject}</p>
                                    <p className="flashcard-item-text">Likes: {cardSet.likes}     Bookmarks: {cardSet.bookmarks}</p>
                                </div>
                                <div className="button-container">
                                    <Link className="account-button" to={`/view/${cardSet.id}`}>View</Link>
                                    <Link className="account-button" to={`/edit/${cardSet.id}`}>Edit</Link>
                                    <Link className="account-button" to="/">Delete</Link>
                                </div>
                            </div>
                        )
                        
                    }) }
                    {userSets.length === 0 ? (
                        <p>Nothing to see here yet! Click <a href="/create">here</a> to start making your own flashcards</p>
                    ) : (
                        userSets.length > 3 ? (
                            !expanded ? (
                                <button onClick={() => setExpanded(true)}>See more</button>
                            ) : (
                                <button onClick={() => setExpanded(false)}>Collapse</button>
                            )
                        ) : (<></>)
                    )}
                    
                </div>
                <div className="my-flashcards-container">
                    <h3 className="align-left">Bookmarks</h3>
                    {bookmarkSets.map(function(cardSet, index) {
                        if (index >= 3 && !expandedB) {
                            return;
                        }
                        return(
                            <div className="flashcard-item" key={uuidv4()}>
                                <div className="center-parent">
                                    <img src="flashcard_logo.png" alt="flashcard logo" className="center"></img>
                                </div>
                                <div className="align-left">
                                    <h2>{cardSet.name}</h2>
                                    <p className="flashcard-item-text">Subject: {cardSet.subject}</p>
                                    <p className="flashcard-item-text">Likes: {cardSet.likes}     Bookmarks: {cardSet.bookmarks}</p>
                                </div>
                                <div className="button-container">
                                    <Link className="account-button" to={`/view/${cardSet.id}`}>View</Link>
                                    <Link className="account-button">Remove</Link>
                                </div>
                            </div>
                        )
                        
                    }) }
                    {bookmarkSets.length === 0 ? (
                        <p>Nothing to see here yet! When you bookmark a flashcard set, you may access them here.</p>
                    ) : (
                        bookmarkSets.length > 3 ? (
                            !expandedB ? (
                                <button onClick={() => setExpandedB(true)}>See more</button>
                            ) : (
                                <button onClick={() => setExpandedB(false)}>Collapse</button>
                            )
                        ) : (<></>)
                    )}
                </div>
            </div>
            <div>
                Followed users: 
            </div>
        </div>
    )
}

export default Account;