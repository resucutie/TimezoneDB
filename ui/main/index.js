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

function setCookie(name, value, days = 120) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
}
function getCookie(name) {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

window.onload = async () => {
    try {
        //other
        const options = document.querySelector(".options-card")
        const customTz = document.querySelector(".custom-timezone")
        //buttons
        const loginButton = document.querySelector(".login")
        const logoutButton = document.querySelector(".logout")
        const changeButton = document.querySelector(".change")
        const darkMode = document.querySelector(".dark-mode")
        //inputs
        const editTimezoneInput = document.querySelector(".edit-timezone")
        //selectors
        const tzSelector = document.querySelector(".select-timezone")
        const tzIndicator = document.querySelector(".select-timezone-indicator")

        function updateTheme() {
            let cookie = getCookie("dark_mode")
            if (!cookie) cookie = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? "yes" : "no"
            document.documentElement.className = cookie === "yes" ? "theme-dark" : "theme-light"
        }

        updateTheme()

        // logic
        const logged = await isLogged()

        loginButton.hidden = logged
        logoutButton.hidden = !logged
        options.hidden = !logged
        customTz.hidden = true

        let tz

        const user = logged ? await getCurrentUser() : null
        if (logged) {
            tz = user.timezone
            editTimezoneInput.value = tz.substring(1)
            tzIndicator.value = tz.charAt(0)
            let a = false
            for (const opt of tzSelector.options) {
                if (opt.innerText.replace(/ /g, "").replace("\n", "") == "") tzSelector.removeChild(opt)
                if (opt.value === tz && !a) {
                    tzSelector.value = tz
                    a = true
                }
            }
            if (!a) {
                tzSelector.value = "custom"
                customTz.hidden = false
            }
        }

        tzSelector.addEventListener('change', () => {
            if (tzSelector.value === "custom") {
                customTz.hidden = false
                return
            }
            customTz.hidden = true
            tz = tzSelector.value
            console.log(tz)
        })

        loginButton.addEventListener('click', async () => {
            window.location.href = '/api/auth'
        })

        logoutButton.addEventListener('click', async () => {
            window.location.href = `/api/auth/logout?redirecturl=${encodeURIComponent(url)}`
        })

        darkMode.addEventListener('click', () => {
            let cookie = getCookie("dark_mode")
            if (!cookie) cookie = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? "yes" : "no"
            setCookie("dark_mode", cookie === "yes" ? "no" : "yes")
            updateTheme()
        })

        editTimezoneInput.addEventListener('input', () => {
            editTimezoneInput.value = editTimezoneInput.value.replace(/[^\d.:]/g, '')
            if (!(editTimezoneInput.value === "" || Number.isNaN(Number(editTimezoneInput.value)))) tz = String(tzIndicator.value) + String(editTimezoneInput.value)
            console.log(tz)
        })

        changeButton.addEventListener('click', async () => {
            let settingsToPush = {}
            if (editTimezoneInput.value === "" || Number.isNaN(Number(tz))) { alert("Please put a timezone"); editTimezoneInput.select(); return}
            settingsToPush.timezone = tz

            if (Object.keys(settingsToPush).length !== 0) {
                console.log(await editCurrentUser(settingsToPush))
                window.location.reload()
            }
        })
    } catch (err) {
        console.error(err)
        document.body.innerHTML = `
        <h1>an horrible error happened</h1>
        <div>pls contact A user#8169</div><br><br>
        <div style="color: #f00">
            <b>error stack:</b> ${err.stack}
        </div>`
    }
}