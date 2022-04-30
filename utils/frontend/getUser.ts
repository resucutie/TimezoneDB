import { User, UserID } from "../.."

export default async (userId: UserID, loginToken?: string) => {
    try {
        let bodyData: any = {}
        if (loginToken) bodyData.logintoken = loginToken

        const response = await fetch(
            `${window.location.origin}/api/users/${userId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            }
        )

        if (response.ok) {
            return (await response.json()) as User
        } else throw new Error(response.statusText)
    } catch (e) {
        console.error(e)
    }
}
