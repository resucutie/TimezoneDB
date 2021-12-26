
/// <reference path="index.d.ts" />

import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import cors from "cors"
import colors from "colors"
import cookieParser from "cookie-parser"

import constants from "./utils/constants.js"
import { addUser, getUser } from './utils/db.js'
import DebguRouter from './routes/dbg.js'
import ApiRouter from './routes/api.js'
import { mainPage } from './ui/index.js'

const app = express()

app.use(cookieParser())

app.use(express.json())
app.use(cors())

app.use("/api", ApiRouter);
app.use("/dbg", DebguRouter);

// this prevents express from being stupid and parsing {} in query paramaters into actual objects
app.set('query parser', 'simple');

app.use("/gui", express.static(mainPage))

app.get("/", (req, res) => {
    res.redirect("/gui")
})

app.listen(process.env.PORT || constants.PORT, async () => {
    const date = new Date()
    console.log(`${colors.gray(date.getHours() + ":" + date.getMinutes())} ${colors.green.bold("✓")} Sucessfully listened! Check at ${String(constants.URL).cyan}`)
})