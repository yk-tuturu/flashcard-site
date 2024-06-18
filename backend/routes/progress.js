import express from "express"
import {saveProgress, getFlashProgress, test } from "../controllers/progress.js"

const router = express.Router()

router.post("/saveProgress", saveProgress)
router.get("/getFlashProgress", getFlashProgress)
router.get("/test", test)

export default router