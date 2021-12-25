import nedb from "nedb-promises"
import { ensureTimezone } from "./timezones.js"
import { DBException } from "./exceptions.js"
import constants from "./constants.js"
import { getCurrentUser } from "./discordApi.js"

const users: any = nedb.create({
    filename:  process.env.DB_PATH || "/db/database.db",
    inMemoryOnly: false,
    autoload: true
})

users.persistence.setAutocompactionInterval(3600000) // 1 hour;

const addUser = async (id: string, timezone: Timezone = "+0") => {
    const ensuredTz = ensureTimezone(timezone)

    if (await getUser(id)) throw new DBException(`${id} Already exists.`, constants.ExceptionCodes.DB.ALREADY_EXISTING_USER)
    
    await users.insert({
        userId: id,
        timezone: ensuredTz
    })
}

interface EditUserSettingsProps {
    timezone?: Timezone
}
const editUser = async (id: string, { timezone }: EditUserSettingsProps) => {
    const currentUser = await getUser(id)

    if (!currentUser) throw new DBException(`${id} does not exist.`, constants.ExceptionCodes.DB.UNEXISTING_USER)
    
    const ensuredTz = timezone ? ensureTimezone(timezone) : currentUser.timezone

    await users.update({
        userId: id
    }, {
        userId: id,
        timezone: ensuredTz
    })

    console.log("updated", await getUser(id))

    return currentUser
}

const deleteUser = (id: string) => {
    if (!getUser(id)) throw new DBException(`${id} does not exist.`, constants.ExceptionCodes.DB.UNEXISTING_USER)

    users.remove({
        userId: id,
    }, {})
}

const getUser = async (id: string) => {
    let found = await users.findOne({ userId: id })
    delete found?._id
    return found
}

const doesUserExist = async (id: string) => {
    return Boolean(await getUser(id))
}

const getUserTimezone = async (id: string) => {
    const user = await getUser(id)
    if (!user) throw new DBException(`${id} does not exist.`, constants.ExceptionCodes.DB.UNEXISTING_USER)
    //@ts-ignore yeah i give up trying to fix ts being dum dum
    return await getUser(id).timezone
}

export {
    addUser,
    deleteUser,
    getUser,
    doesUserExist,
    getUserTimezone,
    editUser
}