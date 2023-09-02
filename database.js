// imports
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
    db.run("CREATE TABLE if not exists user (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, role TEXT)", (err) => {
        if (err) {
            console.error("Error creating table", err);
        } else {
            console.log("User table created or already exists.");
        }
    });
});

function closeDb() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

// automatically close db when interrupt
// process.on('SIGINT', closeDb);

module.exports = {
    db,
    closeDb
};
