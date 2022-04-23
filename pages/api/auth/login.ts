import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from '../../../handlers/db'
import bcrypt from "bcrypt"
import { getUsernameId } from '../../../handlers/cache'
import jwt from "jsonwebtoken"
// import { contains } from '../../../handlers/ambiguition'

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method !== 'POST') return

    let {
        username,
        password,
        logintoken
    } = req.body

    if(logintoken && (!username || !password)) {
        try {
            const decoded = jwt.verify(logintoken, process.env.JWT_SECRET as string);
            console.log(decoded)
            username = (decoded as any).username
            password = (decoded as any).password
        } catch (err) {
            return res.status(400).send('Wrong JWT login information')
        }
    }

    if (!username || !password) return res.status(400).send('Missing username or password')

    const id = await getUsernameId(username)
    if (!id) return res.status(400).send('User does not exist. Please try /api/auth/sign')

    let user = await get(id, true, true)
    
    const holyFuckingYesIsThisTheRightGuy = await bcrypt.compare(password, user.private.passwordHash)
    if (!holyFuckingYesIsThisTheRightGuy) return res.status(401).send('Incorrect password. And no, please don\'t try to hack this server.')

    delete user.private.passwordHash

    const token = logintoken ?? jwt.sign({ username, password }, process.env.JWT_SECRET as string, { expiresIn: '30d' })

    res.status(200).send(user)
}
