import type { NextApiRequest, NextApiResponse } from "next"
import { edit, get } from "../../../handlers/db"
import bcrypt from "bcrypt"
import { getUsernameId } from "../../../handlers/cache"
import jwt from "jsonwebtoken"
import verifyLogIn from "../../../utils/backend/verifyLogIn"
import isTimezone from "../../../utils/isTimezone"
import NextCors from "nextjs-cors"
import supportedServices from "../../../constants/supportedServices.json"
// import { contains } from '../../../handlers/ambiguition'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    await NextCors(req, res, {
        origin: "*",
    })

    if (req.method !== "POST") return

    let {
        logintoken,
        services,
    }: { logintoken: string; services: { [key: string]: string } } = req.body

    let user = await verifyLogIn(logintoken, res)
    if (!user) return

    if (!services) return res.status(400).send("Services not provided")
    if (
        !Object.keys(services).some((serviceName) =>
            supportedServices.includes(serviceName)
        )
    )
        return res.status(400).send("Invalid services")

    let currentServices: { [key: string]: string } = Object.assign(
        {},
        user.services,
        services
    )

    // remove key from services if the value is empty
    currentServices = Object.fromEntries(
        Object.entries(services).filter(([key, value]) => value)
    )

    user.services = currentServices as any

    const backup = await edit(user.id as string | bigint, user)
    //@ts-ignore
    delete backup.private.passwordHash

    res.status(200).send(backup)
}
