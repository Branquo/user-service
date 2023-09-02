const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// db connection to users.db
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// create "user" table if not exists
const createUsersTable = () => {
  const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          role TEXT
      )
    `;

  return new Promise((resolve, reject) => {
    db.run(createTableSQL, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Test users
const users = [
  { username: 'admin', password: 'adminPass', role: 'admin' },
  { username: 'user1', password: 'user1Pass', role: 'ordinary' },
  { username: 'user2', password: 'user2Pass', role: 'ordinary' },
];

// hash passwors via bcrypt
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

// insert a user into db
const insertUser = (user, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO user (username, password, role) VALUES (?, ?, ?)`, [user.username, hashedPassword, user.role], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// seed db with test users
const seedUsers = async () => {
  for (let user of users) {
    try {
      await createUsersTable();
      const hashedPassword = await hashPassword(user.password);
      await insertUser(user, hashedPassword);
      console.log(`User ${user.username} added.`);
    } catch (err) {
      console.log(err.message);
    }
  }

  // close after seeding
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
};

seedUsers();
