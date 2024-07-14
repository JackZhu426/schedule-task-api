# Schedule Task API

## Getting Started

After downloading this project, run this app by following steps

### Prerequisite

> Need Docker to spin up the Postgres database and the server, also, kept the `.env.test` config file for e2e testing

1. Docker Compose

2. Node version: v22.4.1

### Usage

#### Run the project via Docker

Once launch the Docker, run the following command on CLI at the dir of the project:

```sh
docker compose up
```

there will be two **_Containers_** created and running, which are `jack-postgres` and `jack-server`, then can test APIs on 1) **Postman**, or 2) **Swagger**: https://localhost:3000/api

#### UAT on Postman (or Swagger)

Base URL: `http://localhost:3000`

Swagger API URL: `https://localhost:3000/api`

| HTTP Request |      API      |                                                                             Body                                                                             |
| :----------: | :-----------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     GET      |   /schedule   |                                                                                                                                                              |
|     GET      | /schedule/:id |                                                                                                                                                              |
|     POST     |   /schedule   |                   ```{"accountId": 2024071402, "agentId": 555, "startTime": "2024-07-15T00:00:00Z", "endTime": "2024-07-16T00:00:00Z"}```                    |
|    PATCH     | /schedule/:id |                   ```{"accountId": 2024071403, "agentId": 556, "startTime": "2024-07-16T00:00:00Z", "endTime": "2024-07-17T00:00:00Z"}```                    |
|    DELETE    | /schedule/:id |                                                                                                                                                              |
|     GET      |     /task     |                                                                                                                                                              |
|     GET      |   /task/:id   |                                                                                                                                                              |
|     POST     |     /task     | ```{"accountId": 2024071401, "scheduleId": "81553fef-ee0d-4fba-9d46-88d2a6e2817c", "startTime": "2024-07-14T23:59:00Z", "duration": 1000, "type": "WORK"}``` |
|    PATCH     |   /task/:id   | ```{"accountId": 2024071401, "scheduleId": "81553fef-ee0d-4fba-9d46-88d2a6e2817c", "startTime": "2024-07-14T23:59:00Z", "duration": 1000, "type": "WORK"}``` |
|    DELETE    |   /task/:id   |                                                                                                                                                              |

<p align="right">(<a href="#top">back to top</a>)</p>

### Unit/Integration test check

After Docker is up and running, by using the commands on the CLI at project dir:

1. Run unit testing:

```sh
npm run test
```

2. Run integration testing:

```sh
npm run test:e2e
```

3. Run the project locally

```sh
npm start
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Testing

### Test Coverage
<img width="731" alt="unit tests" src="https://github.com/user-attachments/assets/41452343-c02a-44c9-b9c7-50543dbfafce">

<p align="right">(<a href="#top">back to top</a>)</p>
