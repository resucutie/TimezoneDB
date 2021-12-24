
/// <reference path="index.d.ts" />

import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import colors from "colors"
import cookieParser from "cookie-parser"

import constants from "./utils/constants.js"
import { addUser, getUser } from './utils/db.js'
import DebguRouter from './routes/dbg.js'
import ApiRouter from './routes/api.js'

const app = express()

app.use(cookieParser())

app.use(express.json())
app.use("/api", ApiRouter);
app.use("/dbg", DebguRouter);

// this prevents express from being stupid and parsing {} in query paramaters into actual objects
app.set('query parser', 'simple');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => res.redirect("/dbg"))

app.listen(constants.PORT, async () => {
    const date = new Date()
    console.log(`${colors.gray(date.getHours() + ":" + date.getMinutes())} ${colors.green.bold("✓")} Sucessfully listened! Check at ${`http://localhost:${constants.PORT}/`.cyan}`)
})