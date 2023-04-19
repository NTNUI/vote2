# Backend

## How to:

### First you need to create a .env file

Here is a working example:

```
COMPOSE_PROJECT_NAME="NTNUI-Vote"
BACKEND_PORT=3000
# Database
DB_URI = "mongodb://devUser:topSecret@localhost:27017/vote?authSource=admin"
MONGO_INITDB_ROOT_USERNAME="devUser"
MONGO_INITDB_ROOT_PASSWORD="topSecret"

NTNUI_TOOLS_API_URL = "https://dev.api.ntnui.no/"
```

### Then you need to create and start the database

With docker it's easy by running this command:
`npm run db`  
To stop the database type: `npm run stop-db`

The local database will use the credentials from your .env. Feel free to edit if you want, but make sure DB_URI includes the correct username and password from the MONGO_INITDB_ROOT variables, as this is used when initializing your database in docker. You can also use a DB_URI for a completely different mongoDB database, if you do not want to use docker.

---

### Then start the server

Install dependencies by typing: `npm i`  
When the database is running you start the server by typing: `npm run dev`

### Endpoint Tests

To run the jest/supertest endpoint tests, run:  
`npm run test`

For this to work remember to run `npm i` and start the database before running the tests.
