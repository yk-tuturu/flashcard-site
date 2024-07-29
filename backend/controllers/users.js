import {db} from "../db.js"

export const getUser = (req, res) => {
    const q = "SELECT ?? from users WHERE user_id = ?"
    const columns = [
        'name',
        'email', // to be filled with whatever info we need
    ]

    db.query(q, [columns, req.params.id], (err, data) => {
        if (err) return res.status(502).json(err)
        
        return res.status(200).json(data)
    })
}

export const getUserBookmarks = (req, res) => {
    const q = "SELECT ?? FROM bookmarks b INNER JOIN flashsets f ON b.flashset_id = f.id WHERE b.user_id = ?"

    const columns = [
        "flashset_id",
        "name",
        "f.user_id",
        "likes",
        "bookmarks",
        "subject"
    ]

    db.query(q, [columns, req.params.id], (err, data) => {
        if (err) return res.status(502).json(err)
        
        return res.status(200).json(data)
    })
}

export const setBookmark = (req, res) => {
    const q = "INSERT INTO bookmarks(`user_id`, `flashset_id`) VALUES (?)"
    const values = [
        req.body.user_id,
        req.body.flashset_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.status(502).json(err);
        console.log(data)

        const q2 = "UPDATE flashsets SET "
        return res.status(200).json("Bookmark created")
    })
}

export const deleteBookmark = (req, res) => {
    const q = "DELETE FROM bookmarks WHERE user_id = ? AND flashset_id = ?"
    
    db.query(q, [req.body.user_id, req.body.flashset_id], (err, data) => {
        if (err) return res.status(502).json(err);
        console.log(data)
        return res.status(200).json("Bookmark deleted")
    })
}