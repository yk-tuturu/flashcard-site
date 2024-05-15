import React from "react"
import {useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../styles/Login.css"

function Register() {
    // to store login info
    const [info, setInfo] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState(null)

    const navigate = useNavigate()

    // update login info
    const handleChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    // submit login
    const handleClick = async(e) => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:8800/api/auth/register", info).then(function(response){
                navigate("/login")
            })
            
        }catch(err){
            console.log(err)
            setError(err.response.data)
        }
    };

    console.log(info)

  return (
    <div className="login-bg content">
        <div className="login-form">
        <h1 className="title">Register</h1>
        <input type="text" placeholder="username" onChange= {handleChange} name="username" className="login-input"></input>
        <input type="text" placeholder="email" onChange= {handleChange} name="email" className="login-input"></input>
        <input type="text" placeholder="password" onChange={handleChange} name="password" className="login-input"></input>
        {error && <label id="incorrect" for="password" className="incorrect">{error}</label>}
        <p id="register">Already have an account? <a href="/login">Login here</a></p>
        <button onClick={handleClick}>Register</button>
        </div>
    </div>
  );
}

export default Register;