# Backend

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

You can modify the given [env](.env)-file if you want, but it should already contain a working setup.

---

### Then start the server

Install dependencies by typing: `npm i`  
When the database is running you start the server by typing: `npm run dev`
