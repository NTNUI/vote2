# Frontend

### How to:

### Make sure the Backend is running

See README for backend [here](../backend/README.md)

### Create a file containing the environment variables

Containing the necessary URLs

Example:  
Filename: `.env.local`  
Contents for developing locally:

```
VITE_BACKEND_URL=http://localhost:3000/
VITE_SOCKET_URL=ws://localhost:3000/status
```

### Then install dependencies and start the app

Install dependencies by typing: `npm i`  
When the database is running you start the server by typing: `npm run dev`

### Unit tests

`npm run test`

### End-to-end tests

`npm run cypress:open`
