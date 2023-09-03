# User service app

This service allows for user management, including adding, updating, and deleting users.

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed.

## Building

1. Clone the repository:
  ```
   git clone https://github.com/Branquo/user-service.git
   cd user-service
  ```

2. Install dependencies:
  ```
  npm init -y
  npm install express body-parser sqlite3 bcrypt jsonwebtoken dotenv axios concurrently cors
  npx degit sveltejs/template svelte-app
  cp ./src/* ./svelte-app/src/
  cd svelte-app
  npm install
  ```

3. Script the concurrent start
  - In root/package.json change "scripts" to:
  ```
  "scripts": {
    "start-backend": "node server.js",
    "start-frontend": "cd svelte-app && npm run dev",
    "start": "concurrently \"npm run start-backend\" \"npm run start-frontend\""
  }
  ```

## Adding test users

1. In seedDatabase.js under `// Test users` change `const users` to your liking
  ```
  const users = [
    { username: 'admin', password: 'adminPass', role: 'admin' },
    { username: 'user1', password: 'user1Pass', role: 'ordinary' },
    { username: 'user2', password: 'user2Pass', role: 'ordinary' },
  ];
  ```

2. In root, run:
```
  node seedDatabase.js
```

## Running

1. Before running, change `.env.example` to `.env` ans ensure it is set up with the required environment variables. 
2. To start the service, in root run:
  npm start

## Using

1. Fetch All users
  - Endpoint: 'GET /users'
  - Headers: 'X-API-TOKEN: userToken'

2. Add a user (admin)
  - Endpoint: 'POST /addUser'
  - Headers: 'X-API-TOKEN: userToken'
  - Body:
  ```
    {
      "username": "example",
      "password": "password123",
      "role": "ordinary"
    }
  ```

3. Delete a user (admin)
  - Endpoint: 'DELETE /deleteUser/{userId}'
  - Headers: 'X-API-TOKEN: userToken'

4. Update a User's Password (admin)
  - Endpoint: 'PUT /updatePassword/{userId}'
  - Headers: 'X-API-TOKEN: userToken'
  - Body:
  ```
    {
      "newPassword": "newPassword123"
    }
  ```

5. Update ...