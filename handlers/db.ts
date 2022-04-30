import path from "path"
import {constants as fsConstants} from "fs"
import fs from "fs/promises"
import bcrypt from "bcrypt"
import * as cache from "./cache"
import { ProtectedUser, User, UserID } from ".."
import mergeDeep from "../utils/mergeDeep"

export let folder = path.join(process.env.DB_FOLDER as string)

export const assetFolder = async () => {
    try {
        await fs.access(folder, fsConstants.F_OK);
        return true
    } catch (err) {
        await fs.mkdir(folder)
        return false
    }
}

export const userExists = async (id: UserID) => {
    return fs.access(path.join(folder, id + ".json"), fsConstants.F_OK)
        .then(() => true)
        .catch(() => false)
}
export const assetUser = async (id: UserID, user?: User) => {
    if (!await userExists(id)) initUser(id, user)
}

export const initUser = async (id: UserID, data?: Object, override = false) => {
    await assetFolder()
    if (await userExists(id) && !override) throw new Error(`User ${id} already exists`)

    fs.writeFile(`${path.join(folder, String(id))}.json`, JSON.stringify(mergeDeep({
        id,
        private: {},
        createdAt: Date.now(),
        timezone: "",
        services: {}
    }, data)))
}

export const create = async (username: string, password: string, strictlyNonExisting = true) => {
    const lastID = BigInt(await cache.get("lastID", -1))
    if (await userExists((lastID + 1n).toString()) && strictlyNonExisting) throw new Error(`User ${lastID} already exists`)

    await initUser((lastID + 1n).toString(), {
        username,
        private: {
            passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10)),
        },
    })

    await cache.write("lastID", (lastID + 1n).toString())
    await cache.addUsername(username, (lastID + 1n).toString())

    return lastID + 1n
}

export const edit = async (id: UserID, newUser: ProtectedUser) => {
    if (!await userExists(id)) throw new Error(`User ${id} does not exist`)

    const prevUser: ProtectedUser  = await get(id, true, true)

    // cache stuff
    if (newUser.username !== prevUser.username) await cache.renameUsername(prevUser.username, newUser.username)

    if (Object.keys(newUser.services as Object).length === 0) {
        for (const key in prevUser.services) {
            const service = await cache.getService(key)
            service.remove(prevUser.services[key])
        }
    } else {
        for (const key in newUser.services) {
            const service = await cache.getService(key)
            if (!service) continue

            if (service.get(prevUser.services[key])) service.remove(prevUser.services[key])

            // console.log(
            //     service.elements,
            //     prevUser.services[key],
            //     service.get(prevUser.services[key])
            // )

            service.write(newUser.services[key], `${id}`)
        }
    }

    fs.writeFile(`${path.join(folder, String(id))}.json`, JSON.stringify(mergeDeep({
        private: prevUser.private ?? {},
        createdAt: prevUser.createdAt ?? Date.now(),
        timezone: prevUser.timezone ?? ""
    }, newUser)))

    return prevUser
}

export const get = async (id: UserID, showPrivate = false, showPasswordHash = false) => {
    if (!await userExists(id)) throw new Error(`User ${id} does not exist`)

    let user = JSON.parse(await fs.readFile(path.join(folder, id + ".json"), { encoding: "utf8" }))
    if (!showPrivate) {
        delete user.private
    } else if (showPrivate && !showPasswordHash) {
        delete user.private.passwordHash
    }

    return user
}

export const remove = async (userId: UserID) => {
    if (!await userExists(userId)) throw new Error(`User ${userId} does not exist`)
    
    await cache.removeUsername((await get(userId)).username)

    fs.rm(path.join(folder, userId + ".json"))
}