import {db} from "../db.js"
import { v4 as uuidv4 } from 'uuid';

export const getFlashSet = (req, res) => {
    const q = "SELECT * from flashsets WHERE id = ?"

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(502).json(err)
        
        return res.status(200).json(data)
    })
}

export const getSets = (req, res) => {
    const q = "SELECT ?? FROM flashsets f INNER JOIN users u ON u.id = f.user_id WHERE public=1 ORDER BY likes LIMIT 10"
    const columns = [
        "f.id",
        "name",
        "subject",
        "length",
        "likes",
        "bookmarks",
        "username"
    ]

    db.query(q, [columns], (err, data) => {
        if (err) return res.status(502).json(err)
        
        return res.status(200).json(data)
    })
}

export const updateFlashSet = (req, res) => {
    console.log("reached update card route")

    const newCards = req.body.cards

    const str = JSON.stringify(newCards)
    console.log(str)
    
    const q = "UPDATE flashsets SET name=?, subject=?, description=?, flashcards = ?, length=? WHERE id=?"
    const values = [
        req.body.name,
        req.body.subject,
        req.body.description,
        str,
        newCards.length, 
        req.params.id
    ]
    db.query(q, values, (err, data) => {
        if (err) return res.status(502).json(err)

        return res.status(200).json("update success")
    })
}

export const createFlashSet = (req, res) => {
    if (!req.body.name) {
        return res.status(404).json("Title must not be null")
    }

    if (!req.body.subject) {
        return res.status(404).json("Subject must not be null")
    }

    const emptyCard = [{
        key: uuidv4(),
        front: "",
        back: ""
    }]

    const q = "INSERT INTO flashsets(`name`, `user_id`, `flashcards`, `subject`, `description`) VALUES (?)"
    const values = [
        req.body.name,
        req.body.user_id,
        JSON.stringify(emptyCard),
        req.body.subject,
        req.body.description
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        return res.status(200).json({id: data.insertId})
    })
}