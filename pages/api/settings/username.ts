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
    if (req.method !== "POST") return

    let { logintoken, username } = req.body
    if (!username) return res.status(400).send("Username is required")

    let user = await verifyLogIn(logintoken, res)
    if (!user) return

    user.username = username

    const backup = await edit(user.id as string | bigint, user)
    //@ts-ignore
    delete backup.private.passwordHash

    res.status(200).send({
        oldUser: backup,
        newlogintoken: jwt.sign(
            {
                username: user.username,
                password: user.private.passwordHash,
            },
            process.env.JWT_SECRET as string
        ),
    })
}
