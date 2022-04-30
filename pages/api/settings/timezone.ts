import type { NextApiRequest, NextApiResponse } from 'next'
import { edit, get } from '../../../handlers/db'
import bcrypt from "bcrypt"
import { getUsernameId } from '../../../handlers/cache'
import jwt from "jsonwebtoken"
import verifyLogIn from '../../../utils/backend/verifyLogIn'
import isTimezone from '../../../utils/isTimezone'
import NextCors from 'nextjs-cors'
// import { contains } from '../../../handlers/ambiguition'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    await NextCors(req, res, {
        origin: "*",
    })
    
    if (req.method !== 'POST') return

    let {
        logintoken,
        timezone
    } = req.body

    let user = await verifyLogIn(logintoken, res)
    if (!user) return res.status(500).send("Uhhhh... a wild error happened. I guess the login token does not provide any information?")

    if (!timezone) return res.status(400).send('Missing timezone')
    if (!isTimezone(timezone)) return res.status(400).send('Invalid timezone')

    user.timezone = timezone

    let backup = await edit(user.id as string | bigint, user)
    //@ts-ignore
    delete backup.private.passwordHash

    res.status(200).send(backup)
}
