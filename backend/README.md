# Backend API Documentation

## Base Route

All user routes are mounted under:

```text
/api/users
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

## Notes

- The server parses JSON requests with `express.json()`.
- The token cookie is set with `httpOnly`, `sameSite: 'strict'`, and `secure` enabled in production.
