import express from "express"
import { getFlashSet } from "../controllers/cards.js"

const router = express.Router()

router.get("/:id", getFlashSet)

export default router