import fetch from "node-fetch";
import constants from "./constants.js";

async function requestAuthorization(code: string) {
    let bodyReq: any = {
        client_id: process.env.DISCORD_ID || "",
        client_secret: process.env.DISCORD_SECRET || "",
        code,
        grant_type: 'authorization_code',
        redirect_uri: (process.env.PROD == "true") ? `https://timezonedb.catvibers.me/api/auth` : `http://localhost:${constants.PORT}/api/auth`,
        scope: 'identify',
    }

    return await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams(bodyReq),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(res => res.json()) as any as OAuth2TokenResponse
}

async function getCurrentUser(oauthToken: string) {
    return await fetch("https://discord.com/api/v9/users/@me", {
        headers: {
            "Authorization": "Bearer " + oauthToken,
        }
    }).then(res => res.json()) as UserObject
}

export {
    getCurrentUser,
    requestAuthorization
}