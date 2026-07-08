# README: User Registration Endpoint

## Endpoint: `/users/register`

### Description

This endpoint allows new users to register by providing their full name, email, and password. The endpoint validates the provided data, hashes the password for security, and stores the user information in the database.

### Request Method

`POST`

### Request Body

The request body must be in JSON format and include the following fields:

| Field              | Type   | Required | Description                                |
| ------------------ | ------ | -------- | ------------------------------------------ |
| fullname           | Object | Yes      | Contains `firstname` and `lastname`        |
| fullname.firstname | String | Yes      | First name of the user (min 3 chars)       |
| fullname.lastname  | String | No       | Last name of the user (min 3 chars)        |
| email              | String | Yes      | User's email address (unique, min 5 chars) |
| password           | String | Yes      | User's password (min 5 chars)              |

Example:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Response

#### Success Response

| Status Code | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| 201         | User successfully created. Returns a token and user object. |

Example:

```json
{
  "token": "eyJhbGciOiJI...",
  "user": {
    "_id": "64a5f9b3d4",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error Responses

| Status Code | Description                         |
| ----------- | ----------------------------------- |
| 400         | Validation error or missing fields. |
| 500         | Internal server error.              |

### Data Flow Diagram

```mermaid
graph TD
    A[Client] -->|POST /users/register| B[Controller]
    B -->|Validate Request| C[Validation Middleware]
    C -->|Pass| D[Controller]
    D -->|Hash Password| E[Model]
    D -->|Create User| F[Service]
    F --> G[Database]
    D -->|Generate Token| H[Model]
    H -->|Return Response| A
```

### Files Overview

#### Controllers (`user.controllers.js`)

- Validates input.
- Interacts with services to handle registration logic.

#### Services (`user.services.js`)

- Contains the business logic for user creation.
- Handles checks for required fields.

#### Models (`user.model.js`)

- Defines the schema for user data.
- Provides methods for password hashing and token generation.


## Endpoint: `/users/login`

### Description
Authenticates a user using their email and password, returning a JWT token upon successful login.

### Request Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:

| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| email       | String | Yes      | User's email address (must be a valid email). |
| password    | String | Yes      | User's password (minimum 6 characters).      |

Example:
```json
{
    "email": "john.doe@example.com",
    "password": "securePassword123"
}
```

### Response
#### Success Response
| Status Code | Description             |
|-------------|-------------------------|
| 200         | User successfully authenticated. Returns a token and user object. |

Example:
```json
{
    "token": "eyJhbGciOiJI...",
    "user": {
        "fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "email": "john.doe@example.com"
    }
}
```

#### Error Responses
| Status Code | Description                    |
|-------------|--------------------------------|
| 400         | Invalid credentials or missing fields. |
| 500         | Internal server error.         |

### Data Flow Diagram
```mermaid
graph TD
    A[Client] -->|POST /users/login| B[Controller]
    B -->|Validate Request| C[Validation Middleware]
    C -->|Pass| D[Controller]
    D -->|Find User| E[Service]
    E -->|Check Password| F[Model]
    F -->|Generate Token| G[Model]
    G -->|Return Response| A
```
## Endpoint: `/users/logout`
```http
POST /logout HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response:
```json
{
  "message": "logged out successfully"
}
```

### Subsequent Unauthorized Request:
#### Request:
```http
GET /protected-resource HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response:
```json
{
  "message": "unauthorized"
}
```

---



### URL
`POST /captains/register`

### Request Format
The request body should be in JSON format, with the following structure:

```json
{
    "fullname": {
        "firstname": "string (min: 3 characters)",
        "lastname": "string (min: 3 characters)"
    },
    "email": "valid email address",
    "password": "string (min: 6 characters)",
    "vehicle": {
        "color": "string (min: 3 characters)",
        "plate": "string (min: 3 characters)",
        "capacity": "integer (min: 1)",
        "vehicleType": "enum ('car', 'motorcycle', 'auto')"
    }
}
```

### Response Format
#### Success Response
If the registration is successful, the API returns:

```json
{
    "token": "JWT authentication token",
    "captain": {
        "fullname": {
            "firstname": "string",
            "lastname": "string"
        },
        "email": "string",
        "password": "hashed string",
        "status": "string (default: inactive)",
        "vehicle": {
            "color": "string",
            "plate": "string",
            "capacity": "integer",
            "vehicleType": "string"
        },
        "_id": "string (MongoDB ObjectId)",
        "__v": "integer"
    }
}
```

#### Error Response
In case of validation or server errors, the API returns:

```json
{
    "errors": [
        { "field": "string", "message": "string" }
    ]
}
```

Or:

```json
{
    "message": "string"
}
```

---
















---

## Endpoint `POST /captains/register`
 

### URL

### Request Format
The request body should be in JSON format, with the following structure:

```json
{
    "fullname": {
        "firstname": "string (min: 3 characters)",
        "lastname": "string (min: 3 characters)"
    },
    "email": "valid email address",
    "password": "string (min: 6 characters)",
    "vehicle": {
        "color": "string (min: 3 characters)",
        "plate": "string (min: 3 characters)",
        "capacity": "integer (min: 1)",
        "vehicleType": "enum ('car', 'motorcycle', 'auto')"
    }
}
```

### Response Format
#### Success Response
If the registration is successful, the API returns:

```json
{
    "token": "JWT authentication token",
    "captain": {
        "fullname": {
            "firstname": "string",
            "lastname": "string"
        },
        "email": "string",
        "password": "hashed string",
        "status": "string (default: inactive)",
        "vehicle": {
            "color": "string",
            "plate": "string",
            "capacity": "integer",
            "vehicleType": "string"
        },
        "_id": "string (MongoDB ObjectId)",
        "__v": "integer"
    }
}
```

#### Error Response
In case of validation or server errors, the API returns:

```json
{
    "errors": [
        { "field": "string", "message": "string" }
    ]
}
```

Or:

```json
{
    "message": "string"
}
```

---

