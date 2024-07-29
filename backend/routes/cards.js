import express from "express"
import { getFlashSet, updateFlashSet, getSets, createFlashSet, getUserSets, getBookmarkCount} from "../controllers/cards.js"

const router = express.Router()

router.get("/:id", getFlashSet)
router.post("/update/:id", updateFlashSet)
router.get("/", getSets)
router.post("/create", createFlashSet)
router.get("/user/:user_id", getUserSets)
router.get("/bookmarkCount/:id", getBookmarkCount)
//router.get("/bookmark/:user-id")
//router.get("/like/:user-id")

export default router