export interface User {
    ids?: {
        discord: string;
    };
    createdAt?: number;
    username: string;
}

export interface ProtectedUser extends User {
    private: {
        // email: string;
        passwordHash: string;
    }
}

export type UserID = string | bigint