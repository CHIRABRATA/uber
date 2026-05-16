# Backend API Documentation

## User Registration Endpoint

### `POST /api/users/register`

Creates a new user account and returns a JWT token in the response body and a `token` cookie.

> Note: In the current code, the router is mounted at `/api/users` and the register route is `/register`, so the full endpoint is `/api/users/register`.

### Description

This endpoint registers a new user. It validates the request body, checks whether the email already exists, saves the user, and generates an auth token.

### Required Request Data

Send JSON in the request body with these fields:

- `name` - string, required, cannot be empty
- `email` - string, required, must be a valid email address
- `password` - string, required, minimum 6 characters
- `role` - string, required, must be either `rider` or `driver`

### Example Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "rider"
}
```

### Success Response

#### `201 Created`

Returns the generated token.

```json
{
  "token": "jwt_token_here"
}
```

The response also sets a `token` cookie.

### Error Responses

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

Returned when an unexpected server error occurs.

```json
{
  "message": "Server error"
}
```

## Notes

- The server parses JSON requests with `express.json()`.
- The token cookie is set with `httpOnly`, `sameSite: 'strict'`, and `secure` enabled in production.
