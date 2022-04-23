import path from "path"
import {constants as fsConstants} from "fs"
import fs from "fs/promises"
import { write as writeCache, get as getCache, addUsername, removeUsername } from "./cache"
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
        private: {},
        createdAt: Date.now(),
    }, data)))
}

export const create = async (user: ProtectedUser, strictlyNonExisting = true) => {
    const lastID = BigInt(await getCache("lastID", -1))
    if (await userExists((lastID + 1n).toString()) && strictlyNonExisting) throw new Error(`User ${lastID} already exists`)

    await initUser((lastID + 1n).toString(), user)

    await writeCache("lastID", (lastID + 1n).toString())
    await addUsername(user.username, (lastID + 1n).toString())

    return lastID + 1n
}

export const edit = async (id: UserID, newUser: ProtectedUser) => {
    if (!await userExists(id)) throw new Error(`User ${id} does not exist`)

    const prevUser = await get(id)

    fs.writeFile(`${path.join(folder, String(id))}.json`, JSON.stringify(mergeDeep({
        private: {},
        createdAt: Date.now(),
    }, prevUser, newUser)))

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
    
    await removeUsername((await get(userId)).username)

    fs.rm(path.join(folder, userId + ".json"))
}