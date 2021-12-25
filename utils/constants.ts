interface yes {
    PORT: number,
    URL?: string
    ExceptionCodes: {
        Timezones: {
            INVALID_CITY: string,
            NOT_HMTZ_FORMAT: string,
            NOT_HTZ_FORMAT: string,
            INVALID_FORMAT: string,

            InvalidFormatReasons: {
                NO_SIGN: string,
                NOT_A_NUMBER: string,
                NOT_HTZ_FORMAT: string,
                OVERFLOW: string,
                UNDEFINED: string
            }
        },
        Date: {
            INVALID_DATE: string
        },
        DB: {
            ALREADY_EXISTING_USER: string,
            UNEXISTING_USER: string,
            UNSET_ID: string
        },
        LoginConnections: {
            NOT_LOGGED: string,
            INVALID_SETTINGS: string
        },
        Connection: {
            DIFFERENT_USER: string
        }
    },
}

let constants: yes = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8001,
    ExceptionCodes: {
        Timezones: {
            INVALID_CITY: "INVALID_CITY",
            NOT_HMTZ_FORMAT: "NOT_HMTZ_FORMAT",
            NOT_HTZ_FORMAT: "NOT_HTZ_FORMAT",
            INVALID_FORMAT: "INVALID_FORMAT",

            InvalidFormatReasons: {
                NO_SIGN: "NO_SIGN",
                NOT_A_NUMBER: "NOT_A_NUMBER",
                NOT_HTZ_FORMAT: "NOT_HTZ_FORMAT",
                OVERFLOW: "OVERFLOW",
                UNDEFINED: "UNDEFINED"
            }
        },
        Date: {
            INVALID_DATE: "INVALID_DATE"
        },
        DB: {
            ALREADY_EXISTING_USER: "ALREADY_EXISTING_USER",
            UNEXISTING_USER: "UNEXISTING_USER",
            UNSET_ID: "UNSET_ID"
        },
        LoginConnections: {
            NOT_LOGGED: "NOT_LOGGED",
            INVALID_SETTINGS: "INVALID_SETTINGS"
        },
        Connection: {
            DIFFERENT_USER: "DIFFERENT_USER"
        }
    },
}

constants.URL = `http://localhost:${constants.PORT}/`

export default constants