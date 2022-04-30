import * as Temporal from "temporal-polyfill"

export default (timezone: any) => {
    try{
        Temporal.TimeZone.from(timezone)
        return true
    } catch (e) {
        return false
    }
}