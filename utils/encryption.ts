import jwt from "jsonwebtoken"
import constants from "./constants.js"

interface LoginCookies {
    userId: string;
};

function getUserInfo(cookeis: any) {
    //@ts-ignore
    return jwt.verify(cookeis, process.env.JWT_SECRET) as LoginCookies
}

export {
    getUserInfo
}