# User service app

This service allows for user management, including adding, updating, and deleting users.

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed.

## Building

1. Clone the repository:
  '''bash
   git clone https://github.com/Branquo/user-service.git
   cd user-service

2. Install dependencies:
  npm init -y
  npm install express body-parser sqlite3 bcrypt jsonwebtoken dotenv axios concurrently cors
  npx degit sveltejs/template svelte-app

3. Script the concurrent start
  In package.json add:
  "scripts": {
    "start-backend": "node server.js",
    "start-frontend": "cd svelte-app && npm run dev",
    "start": "concurrently \"npm run start-backend\" \"npm run start-frontend\""
  }

## Running

1. Before running, ensure `.env` is set up with the required environment variables. 
2. To start the service, run:
  npm start

## Using

1. Fetch All users
  - Endpoint: 'GET /users'
  - Headers: 'X-API-TOKEN: userToken'

2. Add a user (admin)
  - Endpoint: 'POST /addUser'
  - Headers: 'X-API-TOKEN: userToken'
  - Body:
    {
      "username": "example",
      "password": "password123",
      "role": "ordinary"
    }

3. Delete a user (admin)
  - Endpoint: 'DELETE /deleteUser/{userId}'
  - Headers: 'X-API-TOKEN: userToken'

4. Update a User's Password (admin)
  - Endpoint: 'PUT /updatePassword/{userId}'
  - Headers: 'X-API-TOKEN: userToken'
  - Body:
    {
      "newPassword": "newPassword123"
    }

5. Update ...