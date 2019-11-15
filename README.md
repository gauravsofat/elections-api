# DA-IICT Elections API

API for the DA-IICT Elections built with NodeJS.

> For the frontend that supports this API please go here - https://github.com/statebait/elections-frontend

## Development

- You need Node & Yarn to run this application. Download them here - [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com).

- You need to setup a .env file in the root of the directory of the following structure (You will need a mongoDB database hosted locally or elsewhere):

  ```bash
  PORT=#Optional (Default is 5000)
  DB_HOST=#Specify your mongoDB url
  ADMIN_ID="201601000" #The Admin ID to login into the admin panel
  LOGIN_SECRET=#Any random string
  ```

- Run the following to install dependencies:

  ```bash
  yarn
  ```

- Next run the following to populate the Database with some test data:

  ```bash
  node scripts/generateDevData.js
  ```

  The 2 users generated are:

  The regular user for testing vote mechanism:

  ```
  Name: John Doe
  SID: 201601001
  Password: johndoe
  ```

  The admin user for testing admin tools:

  ```
  Name: Admin
  SID: 201601000
  Password: admin
  ```

- Finally run the following to start the server:

  ```bash
  yarn dev
  ```
