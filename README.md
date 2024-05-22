# Vows Technical Test Project

## About
This project implement CRUD function using NodeJS (Express) and MongoDB. Also, it used Redis for Caching.

## How to build
### Using git clone and install the project
You can build and test this project using `git clone`, install the dependencies, and run `npm run start-dev`

### Using Docker
Or if you want, I have build `Dockerfile` to run it in Docke. First you need to run `docker-compose compile` and if the process are done, run `docker-compose up`.

## Feature
As it builds as RestAPI, there are several endpoints. Here are the description, what payload, and what returned value from those endpoints.

### Notes
Please hit the `POST /api/users` and `POST /api/authentications/login` first to get AccessToken

### User Info
* `GET /api/users`
    * `payload`: -
    * `returns`: message, code, and data
    * `Authentication`: `Bearer Token`
* `POST /api/users`
    * `payload`: userName: string, password: string, accountNumber: integer, emailAddress: string, registrationNumber: string, fullName: string
    * `returns`: message, code, and data
* `PUT /api/users/:id`
    * `payload`: accountNumber: integer, emailAddress: string, registrationNumber: string, fullName: string
    * `returns`: message, code, and updated data
    * `Authentication`: `Bearer Token`
* `GET /api/users/:id`
    * `payload`: -
    * `returns`: message, code, and data
    * `Authentication`: `Bearer Token`
* `GET /api/users/registration-number/:registrationNumber`
    * `payload`: -
    * `returns`: message, code, and data
    * `Authentication`: `Bearer Token`
* `GET /api/users/account-number/:accountNumber`
    * `payload`: -
    * `returns`: message, code, and data
    * `Authentication`: `Bearer Token`

### Account Login
`GET /api/accounts`
    - `payload`: -
    - `returns`: message, code, and data
    - `Authentication`: `Bearer Token`
`PUT /api/accounts/:id`
    - `payload`: userName: string, password: string
    - `returns`: message, code, and updated data
    - `Authentication`: `Bearer Token`
`GET /api/accounts/:id`
    - `payload`: -
    - `returns`: message, code, and data
    - `Authentication`: `Bearer Token`
`GET /api/accounts/3days/login`
    - `payload`: -
    - `returns`: message, code, and data
    - `Authentication`: `Bearer Token`

### Account Login
`POST /api/authentications/login`
    - `payload`: userName: string, password: string
    - `returns`: message, code, and data
`PUT /api/authentications/logout`
    - `payload`: userName: string
    - `returns`: message, code, and updated data
    - `Authentication`: `Bearer Token`