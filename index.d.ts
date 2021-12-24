/// <reference path="./node_modules/nedb-promises/index.d.ts" />

declare type Timezone = string
declare type HMTimezone = string

type NedbPromisesDocument = {
    _id: string
    createdAt?: Date
    updatedAt?: Date
}

declare interface DiscordRequestError {
    error_description: string
    error: string
}

declare interface DiscordUnauthorizedError {
    message: string
    code: number
}

declare interface OAuth2TokenResponse extends DiscordRequestError{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

declare interface UserObject extends NedbPromisesDocument {
    id: string
    timezone: Timezone
}