# User service app

This service allows for user management, including adding, updating, and deleting users.

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed.

## Building

1. Run
```
docker-compose build
docker-compose up
```

2. Go to http://localhost:3000/api-docs or install the front-end:
  ```
  npx degit sveltejs/template svelte-app
  cp ./src/* ./svelte-app/src/
  cp ./svelte-package/* ./svelte-app/
  cd svelte-app
  npm install
  npm run dev
  ```

or (without docker)


1. Clone the repository:
  ```
   git clone https://github.com/Branquo/user-service.git
   cd user-service
  ```

2. Install dependencies:
  ```
  npm init -y
  npm install express body-parser sqlite3 bcrypt jsonwebtoken dotenv axios concurrently cors express-swagger-generator
  npx degit sveltejs/template svelte-app
  cp ./src/* ./svelte-app/src/
  cp ./svelte-package/* ./svelte-app/
  cd svelte-app
  npm install
  ```

## Adding test users

1. In seedDatabase.js under `// Test users` change `const users` to your liking (or keep unchanged to add the following users)
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

1. Before running, change `.env.example` to `.env` and ensure it is set up with the required environment variables. 
2. To start the service, in root run:
```
  npm start
```

## Using

The user service can be used either via the Front-end (Svelte localhost:3000) or via curl commands (using CLI or via localhost:3000/api-docs)

## Integration Tests

```
npm install mocha chai chai-http supertest --save-dev
```

in package.json add to "scripts":
```
  "test": "mocha --exit --timeout 5000 ./test/**/*.test.js"
```

run
```
npm test
```