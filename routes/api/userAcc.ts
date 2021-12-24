import { Router, Response } from "express"
import constants from "../../utils/constants.js";
import { addUser, deleteUser, doesUserExist, editUser, getUser } from "../../utils/db.js";
import { getUserInfo } from "../../utils/encryption.js";
import { errorLog } from "../../utils/log.js";

const UserAccRouter = Router();

// UserAcc.post('/user', async (req, res) => {
//     req.statusCode
//     const id = req.query.id as string

//     if (!id) {
//         res.status(400).send({
//             error_message: "No ID parsed",
//             error_code: constants.ExceptionCodes.DB.UNSET_ID
//         })
//         return
//     }
    
//     if (!(await doesUserExist(id))) await addUser(id, "-3")

//     res.status(201).send(await getUser(id))
// })

UserAccRouter.get('/:id', async (req, res) => {
    try {
        let id = req.params.id as string

        if (!(await doesUserExist(id))) {
            res.status(404).send({
                error_message: "User not found",
                error_code: constants.ExceptionCodes.DB.UNEXISTING_USER
            })
            return
        }

        res.status(200).send(await getUser(id))
    } catch (err) {
        res.status(500).send({
            error_message: "Internal server error"
        })
        errorLog(err)
    }
})

UserAccRouter.get('/:id/exists', async (req, res) => res.status(200).send(await doesUserExist(req.params.id)))

UserAccRouter.get('/', async (req, res) => {
    try {
        res.redirect(`/api/user/${await getUserInfo(req.cookies.loginInfo)?.userId}`)
    } catch (err: any) {
        if (err.message = "jwt must be provided") {
            res.status(401).send({
                error_message: "Not logged in",
                error_code: constants.ExceptionCodes.LoginConnections.NOT_LOGGED
            })
            return
        }
        res.status(500).send({
            error_message: "Internal server error"
        })
        errorLog(err)
    }
})

UserAccRouter.put('/', async (req, res) => {
    try {
        const settings = req.body

        if (!settings) {
            console.log(settings)
            res.status(401).send({
                error_message: "No settings sent",
                error_code: constants.ExceptionCodes.LoginConnections.NO_SETTINGS
            })

            return
        }

        if (
            settings instanceof Object &&
            !(settings instanceof Array) &&
            Object.getOwnPropertyNames(settings).length === 0
        ) {
            console.log(settings)
            res.status(401).send({
                error_message: "No settings sent"
            })

            return
        }

        const currentUserId = await getUserInfo(req.cookies.loginInfo)?.userId
        console.log(currentUserId)

        const oldUser = await editUser(currentUserId, settings)

        res.status(200).send(oldUser)
    } catch (err: any) {
        if (err.message = "jwt must be provided") {
            res.status(401).send({
                error_message: "Not logged in",
                error_code: constants.ExceptionCodes.LoginConnections.NOT_LOGGED
            })
            return
        }
        res.status(500).send({
            error_message: "Internal server error"
        })
        errorLog(err)
    }
})

UserAccRouter.delete('/', async (req, res) => {
    try {
        const loginInfo = await getUserInfo(req.cookies.loginInfo)

        if (!loginInfo.userId) {
            res.status(418).send({
                error_message: "How",
                error_code: "idk how to describe this"
            })
            return
        }

        const oldUser = await getUser(loginInfo.userId)

        await deleteUser(loginInfo.userId)

        res.cookie("loginInfo", {})

        res.status(200).send(oldUser)
    } catch (err: any) {
        if (err.message = "jwt must be provided") {
            res.status(401).send({
                error_message: "Not logged in",
                error_code: constants.ExceptionCodes.LoginConnections.NOT_LOGGED
            })
            return
        }
        res.status(500).send({
            error_message: "Internal server error"
        })
        errorLog(err)
    }
})

export default UserAccRouter;