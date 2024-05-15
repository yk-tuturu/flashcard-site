import {db} from "../db.js"

export const getFlashSet = (req, res) => {
    const q = "SELECT * from flashsets WHERE `id` = ?"

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(502).json(err)
        
        return res.status(200).json(data)
    })
}

export const updateFlashSet = (req, res) => {
    console.log("reached update card route")

    const newCards = req.body

    const str = JSON.stringify(newCards)
    console.log(str)
    
    const q = "UPDATE flashsets SET `flashcards` = ? WHERE `id`=?"
    const values = [
        str, 
        req.params.id
    ]
    db.query(q, values, (err, data) => {
        if (err) return res.status(502).json(err)

        return res.status(200).json("update success")
    })

    
}