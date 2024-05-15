import {React, useContext} from "react"
import {Link} from "react-router-dom"
import { AuthContext } from "../context/authContext";
import "../styles/Navbar.css"

function Navbar() {
  const {logout, currentUser} = useContext(AuthContext)
    return (
      <ul className="navbar">
        {currentUser ? (
          <>
            <Link className="nav-item" to="/login" onClick={logout}>Logout</Link>
            <Link className="nav-item">Account</Link>
          </>
        ) : (
          <Link className="nav-item" to="/login">Login</Link>
        )}
        
        <Link className="nav-item">Create</Link>
        <Link className="nav-item" to="/">Browse</Link>
        <li className="nav-item" style={{float: "left",}}><a href="/">YK's flashcards</a></li>
      </ul>
    );
  }
  
export default Navbar;