
/// <reference path="index.d.ts" />

import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import cors from "cors"
import chalk from "chalk"
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
app.use("/gui", express.static(mainPage))

app.set('query parser', 'simple');

app.get("/", (req, res) => {
    res.redirect("/gui")
})

app.listen(process.env.PORT || constants.PORT, async () => {
    const date = new Date()
    console.log(`${chalk.gray(date.getHours() + ":" + date.getMinutes())} ${chalk.green.bold`✓`} Sucessfully listened! Check at ${chalk.cyan(constants.URL)}`)
})