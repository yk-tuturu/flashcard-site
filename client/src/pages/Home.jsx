import React, {useEffect, useState} from "react"
import axios from "axios"
import "../styles/Home.css";
import HomeListItem from "./HomeListItem.jsx"

function Home() {
  const limit = 10
  
  const [decks, setDecks] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/cards`)
        console.log(res.data)

        const newDecks = res.data.map((deck) => {
          return ({
            id: deck.id,
            name: deck.name,
            author: deck.user_id,
            subject: deck.subject,
            likes: deck.likes,
            bookmarks: deck.bookmarks,
            length: deck.length
          })
        })

        setDecks(newDecks)
      }
      catch(err) {
        console.log(err)
      }
    };
    fetchData()
  }, [limit])
    return (
      <div className="home-content">
          <div className="sidebar">
            <p>Filters</p>
          </div>
          <div>
            <div className="search-wrapper">
              <input type="text" placeholder="Search for flashcards here" className="searchBar"></input>
            </div>
            <div className="home-list">
              {decks.map(function(deck, index) {
                return(
                  <HomeListItem key={index} info={deck}></HomeListItem>
                )
              })}
            </div>
            
        </div>
      </div>
    );
  }
  
  export default Home;