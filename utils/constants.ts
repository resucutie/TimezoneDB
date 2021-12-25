export default {
    PORT: 8001,
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
            NO_SETTINGS: "NO_SETTINGS"
        },
        Connection: {
            DIFFERENT_USER: "DIFFERENT_USER"
        }
    },
}