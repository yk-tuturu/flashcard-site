import {db} from "../db.js"

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

    const newCards = req.body

    const str = JSON.stringify(newCards)
    console.log(str)
    
    const q = "UPDATE flashsets SET flashcards = ?, length=? WHERE id=?"
    const values = [
        str,
        newCards.length, 
        req.params.id
    ]
    db.query(q, values, (err, data) => {
        if (err) return res.status(502).json(err)

        return res.status(200).json("update success")
    })

    
}