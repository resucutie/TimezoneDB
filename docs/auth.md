# Types

Here it is some terminology that we'll use in this document

## Login token

 A [JSON Web Token](https://jwt.io/) used for storing login informations, such as user id and password. This should be stored in cookies



# Calls

## `POST /api/auth/login`

Verifies the credentials of the user and returns the user object, the user ID and a [login token](#login-token) for logging without the username and password

### Parameters

#### Body

| Key                                               |            Type             | Description                                                  |
| ------------------------------------------------- | :-------------------------: | ------------------------------------------------------------ |
| `username` (optional if `logintoken` is provided) |           string            | The user's username. We don't store the user's emails        |
| `password` (optional if `logintoken` is provided) |           string            | The password of the user                                     |
| `logintoken` (optional)                           | [Login token](#login-token) | [Login token](#login-token). You don't need to provide the username and password if used |

### Examples

#### Using `logintoken`

```js
const response = await fetch("http://localhost:3000/api/auth/login", {
	method: "POST",
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
    	"logintoken": yourCookieParser.get("logintoken")
    })
})

if (response.ok) {
	const data = await response.json()
	yourCookieParser.set("logintoken", data.logintoken)
} else {
	console.error("Error: ", response.statusText)
}
```

#### Using password information

```js
const response = await fetch("http://localhost:3000/api/auth/login", {
	method: "POST",
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
    	"username": "Darmok",
        "password": "123"
    })
})

if (response.ok) {
	const data = await response.json()
    console.log({id: data.id, loginToken: data.logintoken})
	yourCookieParser.set("logintoken", data.logintoken)
} else {
	console.error("Error: ", response.statusText)
}
```



## `POST /api/auth/signin`

Creates an account and returns its ID and a [login token](#login-token)

### Parameters

#### Body

| Key        |  Type  | Description                                           |
| ---------- | :----: | ----------------------------------------------------- |
| `username` | string | The user's username. We don't store the user's emails |
| `password` | string | The password of the user                              |

### Example

```js
const response = await fetch("http://localhost:3000/api/auth/signin", {
	method: "POST",
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
    	"username": "Jalad",
        "password": "456"
    })
})

if (response.ok) {
	const data = await response.json()
    console.log({id: data.id, loginToken: data.logintoken})
	yourCookieParser.set("logintoken", data.logintoken)
} else {
	console.error("Error: ", response.statusText)
}
```

