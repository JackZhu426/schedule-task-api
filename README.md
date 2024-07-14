# Schedule Task API

## Getting Started

After downloading this project, run this app by following steps

### Prerequisite

> Need Docker to spin up the Postgres database and the server, also, have kept the `.env.test` config file for e2e testing

1. Docker Compose

2. Node version: v22.4.1

### Usage

#### Install packages

```sh
npm install
```

#### Run the project via Docker

Once launching the Docker, run the following command on CLI at the dir of the project:

```sh
docker compose up
```

there will be two **_Containers_** created and running, which are `jack-postgres` and `jack-server`, then can test APIs on 1) **Postman**, or 2) **Swagger**: https://localhost:3000/api

#### UAT on Postman (or Swagger)

Base URL: `http://localhost:3000`


| HTTP Request |      API      |                                                                             Body                                                                             |
| :----------: | :-----------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     GET      |   /schedule?page=1&limit=10   |                                                                                                                                                              |
|     GET      | /schedule/:id |                                                                                                                                                              |
|     POST     |   /schedule   |                   ```{"accountId": 2024071402, "agentId": 555, "startTime": "2025-07-15T00:00:00Z", "endTime": "2025-07-16T00:00:00Z"}```                    |
|    PATCH     | /schedule/:id |                   ```{"accountId": 2024071403, "agentId": 556, "startTime": "2025-07-16T00:00:00Z", "endTime": "2025-07-17T00:00:00Z"}```                    |
|    DELETE    | /schedule/:id |                                                                                                                                                              |
|     GET      |     /task?page=1&limit=10     |                                                                                                                                                              |
|     GET      |   /task/:id   |                                                                                                                                                              |
|     POST     |     /task     | ```{"accountId": 2025071401, "scheduleId": "81553fef-ee0d-4fba-9d46-88d2a6e2817c", "startTime": "2025-07-14T23:59:00Z", "duration": 1000, "type": "WORK"}``` |
|    PATCH     |   /task/:id   | ```{"accountId": 2025071401, "scheduleId": "81553fef-ee0d-4fba-9d46-88d2a6e2817c", "startTime": "2025-07-14T23:59:00Z", "duration": 1000, "type": "WORK"}``` |
|    DELETE    |   /task/:id   |                                                                                                                                                              |

<p align="right">(<a href="#top">back to top</a>)</p>

#### Payload Schema
##### POST /schedule (with tasks)
> `startTime` should be after the current time, `endTime` should be after `startTime`

| Field Key |   Field Type    |                                           Field Value                                            | Required |
| :-------: | :-------------: | :----------------------------------------------------------------------------------------------: | :------: |
| accountId |       Int       |                                            2025071405                                            |   YES    |
|  agentId  |       Int       |                                               566                                                |   YES    |
| startTime |  String (Date)  |                                      "2025-07-15T00:00:00Z"                                      |   YES    |
|  endTime  |  String (Date)  |                                      "2025-07-17T00:00:00Z"                                      |   YES    |
|   tasks   | Array of Object | [{"accountId": 2025071404, "startTime": "2025-07-14T23:59:00Z","duration": 1000,"type": "WORK"}] |    NO    |

```json
{
    "accountId": 2025071405,
    "agentId": 566,
    "startTime": "2025-07-15T00:00:00Z",
    "endTime": "2025-07-17T00:00:00Z",
    "tasks": [
        {
            "accountId": 2025071404,
            "startTime": "2025-07-14T23:59:00Z",
            "duration": 1000,
            "type": "WORK"
        }
    ]
}
```

##### POST /schedule (without tasks)
> same as above
```json
{
    "accountId": 2025071405,
    "agentId": 566,
    "startTime": "2025-07-15T00:00:00Z",
    "endTime": "2025-07-17T00:00:00Z"
}
```

##### PATCH /schedule/:id
> all fields are **optional**
> 
> `startTime` should be after the current time, `endTime` should be after `startTime`

| Field Key |   Field Type    |                                           Field Value                                            | Required |
| :-------: | :-------------: | :----------------------------------------------------------------------------------------------: | :------: |
| accountId |       Int       |                                            2025071405                                            |    NO    |
|  agentId  |       Int       |                                               566                                                |    NO    |
| startTime |  String (Date)  |                                      "2025-07-15T00:00:00Z"                                      |    NO    |
|  endTime  |  String (Date)  |                                      "2025-07-17T00:00:00Z"                                      |    NO    |
|   tasks   | Array of Object | [{"accountId": 2025071404, "startTime": "2025-07-14T23:59:00Z","duration": 1000,"type": "WORK"}] |    NO    |

```json
{
    "accountId": 444,
    "agentId": 333,
    "startTime": "2025-07-14T23:59:00Z",
    "endTime": "2025-07-15T23:59:00Z"
}
```

<p align="right">(<a href="#top">back to top</a>)</p>

##### POST /task
> `startTime` should be after the current time and, `startTime` + `duration` (i.e. task end time) should be before schedule's `endTime`
> 
> `scheduleId` must be valid

| Field Key  |  Field Type   |              Field Value               | Required |
| :--------: | :-----------: | :------------------------------------: | :------: |
| accountId  |      Int      |               2024071406               |   YES    |
| scheduleId |     UUID      | "851d227e-8e5e-4c3e-9ba4-91016dda5378" |   YES    |
| startTime  | String (Date) |         "2025-07-15T00:00:00Z"         |   YES    |
|  duration  | Int (seconds) |                  1000                  |   YES    |
|    type    |     Enum      |            "WORK" / "BREAK"            |   YES    |

```json
{
    "accountId": 2024071406,
    "scheduleId": "851d227e-8e5e-4c3e-9ba4-91016dda5378",
    "startTime": "2025-07-14T23:59:00Z",
    "duration": 1000,
    "type": "WORK"
}
```

##### PATCH /task/:id
> all fields are **optional**
>
> `startTime` should be after the current time and, `startTime` + `duration` (i.e. task end time) should be before schedule's `endTime`

| Field Key  |  Field Type   |              Field Value               | Required |
| :--------: | :-----------: | :------------------------------------: | :------: |
| accountId  |      Int      |               2024071406               |    NO    |
| scheduleId |     UUID      | "851d227e-8e5e-4c3e-9ba4-91016dda5378" |    NO    |
| startTime  | String (Date) |         "2025-07-15T00:00:00Z"         |    NO    |
|  duration  | Int (seconds) |                  1000                  |    NO    |
|    type    |     Enum      |            "WORK" / "BREAK"            |    NO    |

```json
{
    "accountId": 444
    "scheduleId": "7b4cb425-ef48-4691-b9f7-cabf6d7509de",
    "startTime": "2024-07-12T00:00:00.000Z",
    "duration": 2000,
    "type": "WORK"
}
```
<p align="right">(<a href="#top">back to top</a>)</p>

#### Swagger
> ✨ Also can be used for UAT

Swagger API URL: `https://localhost:3000/api` (📖 could check the data schema)

<img width="1745" alt="image" src="https://github.com/user-attachments/assets/f2d09a35-589c-43ec-816b-6c04775a9ec0">


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

<p align="right">(<a href="#top">back to top</a>)</p>

## Testing

### Unit Test Coverage
<img width="731" alt="unit tests" src="https://github.com/user-attachments/assets/41452343-c02a-44c9-b9c7-50543dbfafce">

### Integration Test
<img width="541" alt="integration test" src="https://github.com/user-attachments/assets/c65d233b-b694-45f1-93ab-beca34113ce9">

### UAT
#### Add a schedule
<img width="784" alt="image" src="https://github.com/user-attachments/assets/bfb79ce2-19c5-452d-81e2-fd782b639a06">

#### Add a schedule (with tasks)
<img width="748" alt="image" src="https://github.com/user-attachments/assets/35538dbe-74e6-4ee3-a9b1-f32c8e0f4d66">

#### Add a schedule - failed
<img width="732" alt="image" src="https://github.com/user-attachments/assets/c20c6b0e-a26f-40df-b112-38b8c9dbce9e">

<img width="743" alt="image" src="https://github.com/user-attachments/assets/f3e73049-d9d9-4600-8e1a-2faa044e3194">

#### Get all schedules
> with query params
<img width="651" alt="image" src="https://github.com/user-attachments/assets/21bf8420-e47e-4f5e-9476-2e678fb9c31d">

> NO query params
<img width="737" alt="image" src="https://github.com/user-attachments/assets/f318eea3-6b4c-4366-a374-221e413e4446">

#### Get one schedule
<img width="729" alt="image" src="https://github.com/user-attachments/assets/69620a2e-a583-4e8b-99a0-6a952bf4d12c">

#### Get one schedule - failed
<img width="713" alt="image" src="https://github.com/user-attachments/assets/3348d72d-6224-4cc7-8091-d91e8ec9bbc3">

#### Update one schedule
<img width="742" alt="image" src="https://github.com/user-attachments/assets/ca8e93a5-4475-4af7-b36b-0ae254ed0b83">

#### Update one schedule - failed
<img width="745" alt="image" src="https://github.com/user-attachments/assets/cfbea8c5-f0f6-448a-9304-153ec9be9bc5">

<img width="738" alt="image" src="https://github.com/user-attachments/assets/9c7881af-1aac-4c02-8d64-db3b2fcadd7c">

#### Delete one schedule
<img width="757" alt="image" src="https://github.com/user-attachments/assets/75fdc27a-8d75-4f9e-ba59-940a1975f607">

#### Add a task
<img width="731" alt="image" src="https://github.com/user-attachments/assets/dd37ef75-eef4-4f36-90d8-3f22a1d8c52e">

#### Add a task - failed
<img width="741" alt="image" src="https://github.com/user-attachments/assets/299fd0f1-53ee-4450-83f1-bb02dfb5f43d">

#### Get all tasks
<img width="740" alt="image" src="https://github.com/user-attachments/assets/d9c83676-d694-4be4-a5c6-bd87f7d711d4">

#### Get one task
<img width="745" alt="image" src="https://github.com/user-attachments/assets/a3391cbf-91f5-4f4c-9754-d4d3359338d6">

#### Update one task
<img width="729" alt="image" src="https://github.com/user-attachments/assets/d075a10b-1d1f-498e-abeb-3cc2b012703c">

#### Update one task - failed
<img width="746" alt="image" src="https://github.com/user-attachments/assets/6c053bf8-a5aa-4528-996a-6ff7d350cc3d">

<img width="737" alt="image" src="https://github.com/user-attachments/assets/1e4c5cea-2a57-403b-b32f-e54e1d6305a9">

#### Delete one task
<img width="726" alt="image" src="https://github.com/user-attachments/assets/be8906dd-1e9f-43db-a4cd-3a01656a577d">

<p align="right">(<a href="#top">back to top</a>)</p>
