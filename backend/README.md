# Backend API Documentation

## Base Route

All user routes are mounted under:

```text
/api/users
```

All captain routes are mounted under:

```text
/api/captains
```

## 1. Register User

### `POST /api/users/register`

Creates a new user account and returns a JWT token in the response body and a `token` cookie.

### Description

This endpoint registers a new user. It validates the request body, checks whether the email already exists, saves the user, and generates an auth token.

### Input Data

Send JSON in the request body with these fields:

- `name` - string, required, cannot be empty
- `email` - string, required, must be a valid email address
- `password` - string, required, minimum 6 characters
- `role` - string, required, must be either `rider` or `driver`

### Example Input

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "rider"
}
```

### Output

#### `201 Created`

```json
{
  "token": "jwt_token_here"
}
```

The response also sets a `token` cookie.

### Other Status Codes

#### `400 Bad Request`

Returned when validation fails or required fields are missing.

Validation error example:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

Other `400` responses:

```json
{
  "message": "Please fill in all fields"
}
```

```json
{
  "message": "User already exists"
}
```

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

## 2. Login User

### `POST /api/users/login`

Logs in an existing user, validates the credentials, and sets a JWT cookie.

### Description

This endpoint checks the user email and password, compares the password with the stored hash, and returns a success message if the credentials are valid.

### Input Data

Send JSON in the request body with these fields:

- `email` - string, required, must be a valid email address
- `password` - string, required, cannot be empty

### Example Input

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Output

#### `200 OK`

```json
{
  "message": "Login successful"
}
```

The response also sets a `token` cookie.

### Other Status Codes

#### `400 Bad Request`

Returned when validation fails or the credentials are invalid.

Validation error example:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Please provide a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

Other `400` responses:

```json
{
  "message": "Invalid credentials"
}
```

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

## 3. Profile

### `GET /api/users/profile`

Returns the currently authenticated user's profile.

### Description

This route is protected by the auth middleware. Send the JWT in the `token` cookie or in the `Authorization: Bearer <token>` header.

### Example Response

#### `200 OK`

```json
{
  "user": {
    "_id": "66f000000000000000000001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "rider",
    "socketId": null
  }
}
```

### Other Status Codes

#### `401 Unauthorized`

Returned when the token is missing, invalid, or revoked.

```json
{
  "message": "No token, authorization denied"
}
```

or

```json
{
  "message": "Token has been revoked"
}
```

#### `404 Not Found`

```json
{
  "message": "User not found"
}
```

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

## 4. Logout User

### `POST /api/users/logout`

Logs out the current user by clearing the cookie and blacklisting the current JWT until it expires.

### Description

The logout route reads the current token, stores it in the blacklist collection with a TTL based on the token expiration, and clears the `token` cookie.

### Example Response

#### `200 OK`

```json
{
  "message": "Logout successful"
}
```

### Other Status Codes

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

## Notes

- The server parses JSON requests with `express.json()`.
- The token cookie is set with `httpOnly`, `sameSite: 'strict'`, and `secure` enabled in production.
- Protected routes such as `GET /api/users/profile` reject revoked tokens through the blacklist check.

## Captain Routes

## 1. Register Captain

### `POST /api/captains/register`

Creates a new captain account and returns a JWT token in the response body and a `token` cookie.

### Description

This endpoint registers a new captain. It validates the request body, checks whether the email already exists, saves the captain, and generates an auth token.

### Input Data

Send JSON in the request body with these fields:

- `name` - string, required, minimum 3 characters
- `email` - string, required, must be a valid email address
- `password` - string, required, minimum 6 characters
- `vehicleType` - string, required, must be `car`, `motorcycle`, or `bicycle`
- `capacity` - number, required, minimum 1

### Example Input

```json
{
  "name": "Atlas Driver",
  "email": "atlas@example.com",
  "password": "password123",
  "vehicleType": "car",
  "capacity": 4
}
```

### Output

#### `201 Created`

```json
{
  "token": "jwt_token_here",
  "captain": {
    "name": "Atlas Driver",
    "email": "atlas@example.com",
    "vehicleType": "car",
    "capacity": 4
  }
}
```

The response also sets a `token` cookie.

### Other Status Codes

#### `400 Bad Request`

Returned when validation fails or required fields are missing.

```json
{
  "message": "Please fill in all fields"
}
```

```json
{
  "message": "Captain already exists"
}
```

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

## 2. Login Captain

### `POST /api/captains/login`

Logs in an existing captain, validates the credentials, and sets a JWT cookie.

### Description

This endpoint checks the captain email and password, compares the password with the stored hash, and returns a success message if the credentials are valid.

### Input Data

Send JSON in the request body with these fields:

- `email` - string, required, must be a valid email address
- `password` - string, required, minimum 6 characters

### Example Input

```json
{
  "email": "atlas@example.com",
  "password": "password123"
}
```

### Output

#### `200 OK`

```json
{
  "message": "Login successful"
}
```

The response also sets a `token` cookie.

### Other Status Codes

#### `400 Bad Request`

Returned when validation fails or the credentials are invalid.

```json
{
  "message": "Invalid credentials"
}
```

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

## 3. Logout Captain

### `POST /api/captains/logout`

Logs out the current captain by clearing the cookie and blacklisting the current JWT until it expires.

### Description

The logout route reads the current token, stores it in the blacklist collection with a TTL based on the token expiration, and clears the `token` cookie.

### Example Response

#### `200 OK`

```json
{
  "message": "Logout successful"
}
```

### Other Status Codes

#### `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```
