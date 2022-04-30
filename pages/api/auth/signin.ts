import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { create, get } from '../../../handlers/db'
import { getUsernameId } from '../../../handlers/cache'
import NextCors from 'nextjs-cors'
// import { contains } from '../../../handlers/ambiguition'

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    await NextCors(req, res, {
        origin: "*",
    })
    
    if(req.method !== 'POST') return

    const {
        username,
        password
    } = req.body

    if (!username || !password) return res.status(400).send('Missing username or password')

    if (await getUsernameId(username)) return res.status(400).send('Already has an existing username')

    const userID = await create(username, password)

    const user = await get(userID)
    console.log(user)

    res.status(200).send({
        user: Object.assign({}, user),
        logintoken: jwt.sign(
            { username, password },
            process.env.JWT_SECRET as string,
            { expiresIn: "30d" }
        ),
    });

    // const userId = await create({
    //     username: "Jalad",
    //     private: {
    //         passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10))
    //     }
    // })
}
