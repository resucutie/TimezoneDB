import jwt from "jsonwebtoken"
import constants from "./constants.js"

interface LoginCookies {
    userId: string;
};

function getUserInfo(cookeis: any) {
    return jwt.verify(cookeis, constants.JWT.SECRET) as LoginCookies
}

export {
    getUserInfo
}