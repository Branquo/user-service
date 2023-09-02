// environmental variable for jwt secret
require('dotenv').config();

// imports
const { db, closeDb } = require('./database');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BLACKLIST } = require('./shared.js');
const { authenticateToken, authorizeRole } = require('./authMiddleware');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const PORT = 3000;

const app = express();

// Middleware setup
app.use(cors()); // cross origin requests
app.use(bodyParser.json()); // middleware to parse json requests



// root route
app.get('/', (req, res) => {
    res.json({ message: 'User service is up and running!' });
});

// get all users with auth
app.get('/users', authenticateToken, (req, res) => {
    const stmt = db.prepare("SELECT id, username, role FROM user");
    stmt.all([], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err.message });
        }
        res.json(rows);
    });
});

// admin route to add new user
app.post('/addUser', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { username, password, role } = req.body;

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password.', error: err.message });
        }

        const stmt = db.prepare("INSERT INTO user (username, password, role) VALUES (?, ?, ?)");

        stmt.run(username, hashedPassword, role, (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error adding user.', error: err.message });
            }

            res.json({ message: 'User added successfully.' });
        });

        stmt.finalize();
    });
});

// admin route to delete user by ID
app.delete('/deleteUser/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const userId = req.params.id;

    const stmt = db.prepare("DELETE FROM user WHERE id = ?");
    stmt.run(userId, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user.', error: err.message });
        }

        res.json({ message: 'User deleted successfully.' });
    });
    stmt.finalize();
});

// start Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// route to register new user
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password.', error: err.message });
        }

        const stmt = db.prepare("INSERT INTO user (username, password, role) VALUES (?, ?, ?)");

        stmt.run(username, hashedPassword, role, (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error registering user.', error: err.message });
            }

            res.json({ message: 'User registered successfully.' });
        });

        stmt.finalize();
    });
});

// route to handle user login and return JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const stmt = db.prepare("SELECT * FROM user WHERE username = ?");
    stmt.get(username, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err.message });
        }

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Check password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error during password check.', error: err.message });
            }

            if (!result) {
                return res.status(400).json({ message: 'Invalid password.' });
            }

            // Password is valid, generate token
            const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

            res.json({ token, role: user.role });
        });
    });

    stmt.finalize();
});

// route to allow user to update their password
app.put('/updatePassword', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required.' });
    }

    // Hash the new password
    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password.', error: err.message });
        }

        const stmt = db.prepare("UPDATE user SET password = ? WHERE id = ?");
        stmt.run(hashedPassword, userId, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating password.', error: err.message });
            }
            res.json({ message: 'Password updated successfully.' });
        });
        stmt.finalize();
    });
});

// admin route to update a user's password
app.put('/updateUserPassword/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required.' });
    }

    // Hash the new password
    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password.', error: err.message });
        }

        const stmt = db.prepare("UPDATE user SET password = ? WHERE id = ?");
        stmt.run(hashedPassword, userId, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating password.', error: err.message });
            }

            res.json({ message: 'Password updated successfully for user.' });
        });

        stmt.finalize();
    });
});

// logout and blacklist token
app.post('/logout', authenticateToken, (req, res) => {
    const token = req.header('X-API-TOKEN');
    BLACKLIST.add(token);
    res.json({ message: 'Logged out successfully.' });
});


// gracefully close db connection when termination signal
process.on('SIGINT', () => {
    closeDb();
    process.exit(0);
});