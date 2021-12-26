# TimezoneDB

Server's code for [Timezones](https://github.com/abUwUser/BDPlugins/tree/main/plugins/Fuses)' TimeTogether feature



## Setup

Before running, you should create a new [Discord Application](https://discord.com/developers/applications) and add a `.env` file in the root of the project with the following keys:

* `DISCORD_SECRET`: Secret from your application. Open your application in the [Discord Developer Portal](https://discord.com/developers/applications) and go to OAuth2 > General, then copy the Client Secret
* `DISCORD_ID`: ID from your application. Open your application in the [Discord Developer Portal](https://discord.com/developers/applications) and go to OAuth2 > General, then copy the Client ID
* `JWT_SECRET`: A random string for login encryption. Can be any value

Then to run it, open your preferred terminal, go to the root of the project and execute `npm start` to start the server. If you're making changes, for automatic reloading, you can execute `npm run watch`



# API

## Types

### `Timezone`

String that indicates the timezone offset **in hours** from UTC. The signal is always exposed, and if it is 0 then a + signal is displayed

Examples:

* `+5` (this should be 17:00 when it is 12:00 in UTC)
* `-7` (this should be 05:00 when it is 12:00 in UTC)
* `+3.5` (this should be 15:30 when it is 12:00 in UTC)
* `+0` (this should be 12:00 when it is 12:00 in UTC)



### User Object

Object that shows the current user information

| Key        | Values                                                       |
| ---------- | ------------------------------------------------------------ |
| `userId`   | [Snowflake](https://discord.com/developers/docs/reference#snowflakes) (User ID) |
| `timezone` | [Timezone](#Timezone)                                        |



## Routes

### `/api/auth`
Api for managing logins and logouts



#### `GET /api/auth`
Logins the user. Will require OAuth2 authorization if the user is disconnected or not logged in. It will create a cookie named `loginInfo` with encrypted information.<br />
Also it will automatically setup an account for it if the user is new

Will redirect to `/api/user` with a status code of [201 Created](https://httpstatuses.com/201) if a new account was created and [303 See Other](https://httpstatuses.com/303) if the account already exists



#### `GET /api/auth/login` 
Alias to `/api/auth`



#### `GET /api/auth/logout` 
Logouts the user. It will clear the `loginInfo` cookie

Returns a [200 OK](https://httpstatuses.com/200) status code when logged out sucessfully






### `/api/user` 
Api for managing users



#### `GET /api/user`
Gets the current user logged in. Automatically redirects to `/api/user/:id`, where `id` is the logged user ID



#### `GET /api/user/:id`
Gets information about the specified user.

Returns a [200 OK](https://httpstatuses.com/200) status code with a [User Object](#user-object)



#### `GET /api/user/:id/exists`

Checks if a specific user exists

Returns a [200 OK](https://httpstatuses.com/200) status code if found and [404 Not Found](https://httpstatuses.com/404) if not



#### `PUT /api/user/`

Edits the current user.

Requires a body with a JSON of those values:

| Key        | Values                |
| ---------- | --------------------- |
| `timezone` | [Timezone](#Timezone) |

Returns a [200 OK](https://httpstatuses.com/200) status code with a [User Object](#User Object) of the user before the changes



#### `DELETE /api/user/`

Deletes the current user account and logouts the user.

Returns a [200 OK](https://httpstatuses.com/200) status code with a [User Object](#user-object) of the user before the changes