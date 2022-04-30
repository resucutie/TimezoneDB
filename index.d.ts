export interface User {
    services: {
        discord?: string;
        [key: string]: string;
    };
    createdAt?: number;
    username: string;
    timezone: import("temporal-polyfill").TimeZoneArg
}

export interface ProtectedUser extends User {
    private: {
        // email: string;
        passwordHash: string;
    }
}

export interface UserWithID extends User {
    id?: UserID
}

export interface LoginUser extends UserWithID {
    logintoken?: string;
}

export interface ProtectedUserWithID extends ProtectedUser {
    id?: UserID
}

export type UserID = string | bigint