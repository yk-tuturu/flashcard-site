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
            <Link className="nav-item" to="/account">Account</Link>
          </>
        ) : (
          <Link className="nav-item" to="/login">Login</Link>
        )}
        
        <Link className="nav-item" to="/create">Create</Link>
        <Link className="nav-item" to="/">Browse</Link>
        <Link className="nav-item" style={{float: "left",}} to="/">YK's flashcards</Link>
      </ul>
    );
  }
  
export default Navbar;