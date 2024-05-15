import {db} from "../db.js"

export const getFlashSet = (req, res) => {
    const q = "SELECT * from flashcards WHERE `flashset_id` = ? ORDER BY `order`"
    console.log("reached")

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.json(err)
        
        console.log(data)
        return res.status(200).json(data)
    })
}

export const updateFlashSet = (req, res) => {
    console.log("reached update card route")

    const newCards = req.body
    console.log(newCards)
    
    const q = "UPDATE flashcards SET `delete`=1 WHERE `flashset_id`=?"
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.json(err)
        
        // what the fuck is this monstrosity
        var query = ""
        query += "UPDATE flashcards SET `delete`=0, front = CASE"
        newCards.forEach((card, index) => {
            query += " WHEN `order`=" + index + " THEN '" + card.front + "' "
        })
        query += " END, back = CASE"
        newCards.forEach((card, index) => {
            query += " WHEN `order`=" + index + " THEN '" + card.back + "' "
        })
        query += " END"
        query += ` WHERE flashset_id = ${req.params.id}`

        console.log(query)
        db.query(query, (err, data) => {
            if (err) return res.json(err);
            console.log(data.changedRows)
            
            if (newCards.length > data.changedRows) {

            }
        })
        
        // console.log("outside loop")
        // const q = "DELETE FROM flashcards WHERE `delete`=1"
        // db.query(q, (err, data) => {
        //     if (err) {
        //         console.log("this is an error")
        //         console.log(err)
        //         return res.json(err);
        //     }
        //     return res.status(200).json("Update successful")
        // })
    })

    
}