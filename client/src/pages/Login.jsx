import React from "react"
import {useState, useContext} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext";
import "../styles/Login.css"


function Login() {
    // to store login info
    const [info, setInfo] = useState({
        username: "", 
        password: ""
    });

    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const {currentUser, login} = useContext(AuthContext)

    axios.defaults.withCredentials = true;

    // update login info
    const handleChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    // submit login
    const handleClick = async(e) => {
        e.preventDefault()
        try{
            await login(info)
            navigate("/")
        }catch(err){
            setError(err.response.data)
        }
    };

    console.log(info)

  return (
    <div className="login-bg content">
        <div className="login-form">
        <h1 className="title">Log In</h1>
        <input type="text" placeholder="username" onChange= {handleChange} name="username" className="login-input"></input>
        <input type="text" placeholder="password" onChange={handleChange} name="password" className="login-input"></input>
        {error && <label id="incorrect" for="password" className="incorrect">{error}</label>}
        <p id="register">Don't have an account? <a href="/register">Register here</a></p>
        <button onClick={handleClick}>Login</button>
        </div>
    </div>
  );
}

export default Login;