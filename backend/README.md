# Backend

### First you need to create and start the database

With docker it's easy by running this command:
`npm run db`  
To stop the database type: `npm run stop-db`

You can modify the given [env](.env)-file if you want, but it should already contain a working setup.

---

### Then start the server

Install dependencies by typing: `npm i`  
When the database is running you start the server by typing: `npm run dev`

___
## Scripts

Install all dependencies **(Run first)**:  
`npm run install:all`

Initialize and start a local MongoDB:  
(Requires docker installed on machine)  
`npm run db`  
Delete/stop MongoDB:  
`npm run stop-db`

Start frontend (dev):  
`npm run frontend`

Start backend (dev):  
(Requires MongoDB to be up and running)  
`npm run backend`

Check prettier:  
`npm run prettier:check`

Auto format whole project with prettier:  
`npm run prettier:format`