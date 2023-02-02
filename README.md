# NTNUI general assembly voting system

This application will authenticate and register attendants at general assemblies for the groups in NTNUI. The application will also provide a voting system.  
This includes the main general assembly for NTNUI as a whole, and other group specific general assemblies.  
The assemblies and voting is organized by the organizers/main board at the given group.

### Permissions:

| Role         | Voting                | Check in                                      |
| ------------ | --------------------- | --------------------------------------------- |
| Organizer    | Add voting See result | Check users in/ scan qr-codes                 |
| Group Member | Vote                  | Access to voting system if qr-code is scanned |

\* An Organizer is a board member of the given group. The main board is allowed to create a general assembly for NTNUI as a whole.

This project is using the [NTNUI API](https://api.ntnui.no/), in combination with [NTNUI TOOLS](https://github.com/NTNUI/ntnui-tools) to manage user permissions. Application specific data is stored in the MongoDB database.

---

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
