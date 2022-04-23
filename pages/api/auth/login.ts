import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from '../../../handlers/db'
import bcrypt from "bcrypt"
import { getUsernameId } from '../../../handlers/cache'
// import { contains } from '../../../handlers/ambiguition'

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method !== 'POST') return

    const {
        username,
        password
    } = req.body

    if (!username || !password) return res.status(400).send('Missing username or password')

    if (!await getUsernameId(username)) return res.status(400).send('User does not exist. Please try /api/auth/sign')

    const user = await get(await getUsernameId(username), false)
    
    const holyFuckingYesIsThisTheRightGuy = await bcrypt.compare(password, user.private.passwordHash)

    if (!holyFuckingYesIsThisTheRightGuy) return res.status(401).send('Incorrect password. And no, please don\'t try to hack this server.')

    res.status(200).send(user)

    // const userId = await create({
    //     username: "Jalad",
    //     private: {
    //         passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10))
    //     }
    // })
}
