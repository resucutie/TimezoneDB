import type { NextApiResponse } from 'next'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getUsernameId } from '../../handlers/cache'
import { get } from '../../handlers/db'
import { ProtectedUser, ProtectedUserWithID, User } from '../..'
import internal from 'stream'

export default async (login: string, res?: NextApiResponse<any>) => {

    if (!login) { res && res.status(401).send("Missing login information"); return }

    let username: string
    let password: string

    try {
        const decoded = jwt.verify(login, process.env.JWT_SECRET as string)
        username = (decoded as any).username
        password = (decoded as any).password
    } catch (err) { res && res.status(401).send("Wrong login token"); return }

    const id = await getUsernameId(username)
    if (!id) { res && res.status(401).send("User does not exist"); return }

    let user = await get(id, true, true)
    const holyFuckingYesIsThisTheRightGuy = await bcrypt.compare(password, user.private.passwordHash)
    if (!holyFuckingYesIsThisTheRightGuy) { res && res.status(401).send("Incorrect password. And no, please don\'t try to hack this server."); return }

    return user as ProtectedUserWithID
}