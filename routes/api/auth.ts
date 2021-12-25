import {Router, Response} from "express"
import constants from "../../utils/constants.js";
import { addUser, deleteUser, doesUserExist, getUser } from "../../utils/db.js";
import { getCurrentUser, requestAuthorization } from "../../utils/discordApi.js";
import jwt from "jsonwebtoken"
import { getUserInfo } from "../../utils/encryption.js";
import { errorLog } from "../../utils/log.js";

const redirectToAuthorizationPage = (res: Response) => {
    if (process.env.PROD == "true") {
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=https%3A%2F%2Ftimezonedb.bigdumb.gq%2Fapi%2Fauth&response_type=code&scope=identify`)
    } else {
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A8001%2Fapi%2Fauth&response_type=code&scope=identify`)
    }
}

interface AuthRequest {
    code?: string;
}

const AuthRouter = Router();

AuthRouter.get("/", async (req, res) => {
    const query: AuthRequest = req.query

    try {
        const loginInfo = getUserInfo(req.cookies.loginInfo)

        const userExists = await doesUserExist(loginInfo.userId)

        if (!userExists) await addUser(loginInfo.userId)

        res.status(userExists ? 303 : 201).redirect("/api/user")
    } catch (err: any) {
        if (err.message = "jwt must be provided") {
            if (!query.code) {
                redirectToAuthorizationPage(res)
                return
            }

            console.log("query.code exists")

            const auth = await requestAuthorization(query.code)

            if (auth.error) {
                console.error(auth)
                return
            }

            const getUser: UserObject = await getCurrentUser(auth.access_token) as UserObject

            res.cookie("loginInfo", jwt.sign({
                userId: getUser.id
            }, 
            //@ts-ignore
            process.env.JWT_SECRET))

            res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl)

            return
        }

        res.status(500).send({
            error_messge: "Internal error",
        })
        
        errorLog(err)
    }
})

/**
 * @see {@link https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put}
 */
AuthRouter.post("/", async (req, res) => {
    res.status(302).redirect("/api/auth") //302 so it can redirect to GET
})

/**
 * @see {@link https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put}
 */
AuthRouter.put("/", async (req, res) => {
    res.status(302).redirect("/api/auth") //302 so it can redirect to GET
})

AuthRouter.get("/logout", async (req, res) => {
    try {
        res.clearCookie("loginInfo")
        res.sendStatus(200)
    } catch (err: any) {
        res.status(500).send({
            error_messge: "Internal error",
        })

        errorLog(err)
    }
})

AuthRouter.get("/login", async (req, res) => {
    res.status(303).redirect("/api/auth")
})

export default AuthRouter;