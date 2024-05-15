import express from "express"
import { getFlashSet, updateFlashSet } from "../controllers/cards.js"

const router = express.Router()

router.get("/:id", getFlashSet)
router.post("/update/:id", updateFlashSet)

export default router