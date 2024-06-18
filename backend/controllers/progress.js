import {db} from "../db.js"

export const getFlashProgress = (req, res) => {
    console.log("getting progress")

    const q = "SELECT `cards` FROM progress WHERE `flashset_id` = ? AND `user_id` = ?"
    const values = [req.query.flashset_id, req.query.user_id]
    console.log(values)
    console.log("hello?")
    db.query(q, values, (err, data) => {
        if (err) {
            console.log("oh no an error")
            return res.status(502).json(err);
        }

        return res.status(200).json(data)
        
    })
}

export const saveProgress = (req, res) => {
    console.log(req.body);

    const q = "UPDATE progress SET `cards` = ? WHERE `user_id` = ? AND `flashset_id` = ?"
    const values = [
        JSON.stringify(req.body.cards),
        req.body.user_id,
        req.body.flashset_id
    ]
    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        if (data.affectedRows <= 0) {
            const q2 = "INSERT INTO progress(`user_id`, `flashset_id`, `cards`) VALUES (?)"
            const newValues = [
                req.body.user_id,
                req.body.flashset_id,
                JSON.stringify(req.body.cards)
            ]
            db.query(q2, [newValues], (err, data) => {
                if (err) return res.json(err);

                return res.status(200).json("Created new progress log successfully")
            })
        }
        else {
            return res.status(200).json("Updated progress log successfully")
        }
        
    })
    
}

export const test = (req, res) => {
    console.log("reached server")
    return res.status(200).json("tester response")
}