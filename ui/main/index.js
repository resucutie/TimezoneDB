const fetch = window.fetch

const url = window.location.origin

const isLogged = async () => {
    const status = await fetch(url + "/api/user", {
        method: 'GET'
    }).then(res => res.status)
    
    if (status === 401) return false
    else if (status === 200) return true
    else throw new Error(`wtf the response was ${status}`)
}

const getCurrentUser = async () => await fetch(url + "/api/user", {
    method: 'GET'
}).then(res => res.json())

const editCurrentUser = async (settings) => await fetch(url + "/api/user", {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(settings)
}).then(res => res.json())

window.onload = async () => {
    //other
    const options = document.querySelector(".options")
    //buttons
    const loginButton = document.querySelector(".login")
    const logoutButton = document.querySelector(".logout")
    const getUserButton = document.querySelector(".get-user")
    const changeButton = document.querySelector(".change")
    //inputs
    const editTimezoneInput = document.querySelector(".edit-timezone")


    // logic
    const logged = await isLogged()

    loginButton.hidden = logged
    logoutButton.hidden = !logged
    options.hidden = !logged

    const user = logged ? await getCurrentUser() : null
    editTimezoneInput.value = user.timezone

    loginButton.addEventListener('click', async () => {
        window.location.href = '/api/auth'
    })

    logoutButton.addEventListener('click', async () => {
        window.location.href = `/api/auth/logout?redirecturl=${encodeURIComponent(url)}`
    })

    getUserButton.addEventListener('click', async () => {
        console.log(user)
    })

    changeButton.addEventListener('click', async () => {
        let settingsToPush = {}
        if (editTimezoneInput.value !== "") settingsToPush.timezone = editTimezoneInput.value

        if (Object.keys(settingsToPush).length !== 0) {
            console.log(await editCurrentUser(settingsToPush))
            window.location.reload()
        }
    })

    editTimezoneInput.addEventListener('input', () => {
        editTimezoneInput.value = editTimezoneInput.value.replace(/[^\d.+-:]/g, '')
    })
}