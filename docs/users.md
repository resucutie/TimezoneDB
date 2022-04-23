

# Types

## User Object

An object that represents the user's information

```json
{
    "private": {},              - Private data
    "createdAt": 1650676108977, - 
    "username": "Darmok",
    "ids": {
        "discord": "69"
    }
}
```

| Key         |                             Type                             | Description                                                  |
| ----------- | :----------------------------------------------------------: | ------------------------------------------------------------ |
| `private`   |                            Object                            | Contains private information that is used and that it isn't shared, such as the password's hash |
| `createdAt` |                          Epoch time                          | The time that the account was created                        |
| `username`  |                            string                            | The username of the user                                     |
| `timezone`  | [IANA Time Zone](https://www.iana.org/time-zones) or UTC offset | The timezone of the user.  Check the [Temporal documentation](https://tc39.es/proposal-temporal/docs/timezone.html) |
| `ids`       |                   [ID Object](#id-object)                    | The IDs of the connected accounts                            |



## ID object

Object that contains the IDs of the connected accounts





# Calls

## `GET /api/users/[id]`

Gets the user information by its ID

### Parameters

#### Body

| Key                     | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `logintoken` (optional) | [Login token](auth#login-token). It sends the private information (except the password hash) if used and matching to the user's token |

### Returns

Returns an [User Object](#user-object)
