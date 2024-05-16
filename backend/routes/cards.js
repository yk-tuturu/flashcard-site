import express from "express"
import { getFlashSet, updateFlashSet, getSets } from "../controllers/cards.js"

const router = express.Router()

router.get("/:id", getFlashSet)
router.post("/update/:id", updateFlashSet)
router.get("/", getSets)

export default router