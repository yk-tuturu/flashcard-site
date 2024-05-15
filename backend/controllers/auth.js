import {db} from "../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    console.log(req.body)
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.status(404).json("User not found!")
        
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password_hash)
        if (!isPasswordCorrect) return res.status(404).json("Incorrect username or password")

        const token = jwt.sign({id: data[0].id}, "jwtkey")
        const {password_hash, ...other} = data[0]

        return res.cookie("access-token", token, {
            httpOnly: true,
            secure:true
        }).status(200).json(other)
    })
}
export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length) return res.status(409).json("User already exists")

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        const q = "INSERT INTO users(`username`, `password_hash`, `email`) VALUES (?)"
        const values = [
            req.body.username,
            hash,
            req.body.email
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("User has been created")
        })
    })
}

export const logout = (req, res) => {
    console.log("reached backend")
    res.clearCookie("access-token", {
        sameSite: "none",
        secure:true
    }).status(200).json("User has been logged out")
}