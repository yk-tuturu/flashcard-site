import React from "react"
import "../styles/Home.css";
import HomeListItem from "./HomeListItem.jsx"

function Home() {
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
              <HomeListItem deckID={1}></HomeListItem>
              <HomeListItem deckID={2}></HomeListItem>
              <HomeListItem deckID={3}></HomeListItem>
              <HomeListItem deckID={4}></HomeListItem>
              <HomeListItem deckID={5}></HomeListItem>
            </div>
            
        </div>
      </div>
    );
  }
  
  export default Home;