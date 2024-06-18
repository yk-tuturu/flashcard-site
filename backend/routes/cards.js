import express from "express"
import { getFlashSet, updateFlashSet, getSets, createFlashSet} from "../controllers/cards.js"

const router = express.Router()

router.get("/:id", getFlashSet)
router.post("/update/:id", updateFlashSet)
router.get("/", getSets)
router.post("/create", createFlashSet)

export default router