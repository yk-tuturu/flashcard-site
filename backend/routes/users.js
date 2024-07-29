import express from "express"
import {getUser, getUserBookmarks, setBookmark, deleteBookmark } from "../controllers/users.js"

const router = express.Router()

//router.get("/:id", getUser)
router.get("/bookmark/:id", getUserBookmarks)
router.post("/setBookmark", setBookmark)
router.post("/deleteBookmark", deleteBookmark)

export default router