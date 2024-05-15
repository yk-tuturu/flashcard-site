import express from "express"
import mysql from "mysql2"
import cors from "cors"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"N1ng3n_sh1kk4ku",
    database: "flashcard_test"
})