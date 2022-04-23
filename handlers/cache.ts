import path from "path"
import fs from "fs/promises"
import { assetFolder } from "./db";
import mergeDeep from "../utils/mergeDeep";
import { UserID } from "..";

export interface Cache {
    ids: {
        [key: string]: IDCacheData;
    }
    usernames?: UsernameData
    [key: string]: any;
}


export const cacheFile = path.join(process.env.CACHE_FILE as string)

// cache manager

export const getAll = async () => {
    try {
        return JSON.parse(await fs.readFile(cacheFile, {encoding: "utf8"})) as Cache
    } catch (err: any | {message: string}) {
        if (err.message = "Uncaught SyntaxError: Unexpected end of JSON input") {
            await init(true)
            return JSON.parse(await fs.readFile(cacheFile, {encoding: "utf8"})) as Cache
        } else if (err.message.includes("ENOENT")) {
            await init(false)
            return JSON.parse(await fs.readFile(cacheFile, {encoding: "utf8"})) as Cache
        } else throw err
    }
}

export const override = async (data: Cache) => {
    await fs.writeFile(cacheFile, JSON.stringify(data))
}

export const save = async (data: Cache) => {
    await override(mergeDeep({}, await getAll(), data))
}

export const get = async (key: string, defaultValue: any) => {
    const data = await getAll()
    return data[key] ?? defaultValue
}

export const write = async (key: string, value: any, strictlyNonExisting = false) => {
    const data = await getAll()
    if (strictlyNonExisting && data.ids[key]) throw new Error(`Key ${key} already exists`)

    data[key] = value
    
    await save(data)
}

export const remove = async (key: string, value: any) => {
    const data = await getAll()
    delete data[key]
    await override(data)
}

export const init = async (overrideEverything = false) => {
    await assetFolder()

    const useFunc = overrideEverything ? override : save
    await useFunc({
        ids: {},
        usernames: {}
    })
}

// id cache

export type IDCacheData = {
    [key: string]: string
}

export interface IDCacheManager {
    elements: IDCacheData;
    get(userIDFromOtherService: string): string
    write(userIDFromOtherService: string, dbUserID: string, strictlyNonExisting?: boolean): void;
    remove(userIDFromOtherService: string): void
}


export const containsIDValues = async () => {
    const cache = await getAll()
    return typeof cache?.ids === 'object'
}

export const createID = async (id: string, overrideIfExists = false) => {
    const cache = await getAll()

    if (!overrideIfExists && cache.ids[id]) throw new Error("Creating an ID that already exists: " + id)

    cache.ids[id] = {}
    await save(cache)

    return id
}

export const getID = async (id: string, createIfDoesNotExist = true) => {
    if (!await containsIDValues()) await init()
    
    const cache = await getAll()

    if (createIfDoesNotExist && !cache.ids[id]) {
        await createID(id)
    }

    const valueIds = cache.ids[id]

    return {
        elements: valueIds,
        get: (userIDFromOtherService: string) => {
            return valueIds[userIDFromOtherService] 
        },
        write: (userIDFromOtherService: string, dbUserID: string, strictlyNonExisting = false) => {
            if (strictlyNonExisting && valueIds[userIDFromOtherService]) throw new Error(`ID ${userIDFromOtherService} from ${id} already exists and contains the value ${dbUserID}`)
            valueIds[userIDFromOtherService] = dbUserID

            save({
                ids: {
                    [id]: valueIds
                }
            })
        },
        remove: (userIDFromOtherService: string) => {
            delete cache.ids[id][userIDFromOtherService]
            override(cache)
        }
    } as IDCacheManager
}

export const removeID = async (id: string) => {
    const cache = await getAll()
    delete cache.ids[id]
    override(cache)
}

// username cache handler

export type UsernameData = {[key: string]: string}

export const getUsernameId = async (username: string) => {
    const cache = await getAll()
    return (cache.usernames as UsernameData)[username]
}

export const addUsername = async (username: string, id: string, errorOnFind = false) => {
    const cache = await getAll()

    if (errorOnFind && getUsernameId(username)) throw new Error("Adding an username that already exists: " + username);

    (cache.usernames as UsernameData)[username] = id

    await save(cache)
}

export const removeUsername = async (username: string) => {
    let cache = await getAll()
    delete (cache.usernames as UsernameData)[username]
    await override(cache)
}