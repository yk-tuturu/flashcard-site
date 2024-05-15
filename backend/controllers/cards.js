import {db} from "../db.js"

export const getFlashSet = (req, res) => {
    const q = "SELECT * from flashcards WHERE `flashset_id` = ?"
    console.log("reached")

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.json(err)
        
        console.log(data)
        return res.status(200).json(data)
    })
}