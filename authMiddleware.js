// import 
const jwt = require('jsonwebtoken');

// environmental variable for jwt secret
const jwtSecret = process.env.JWT_SECRET;

// token blacklist
const { BLACKLIST } = require('./shared.js');

/**
 * Middleware to authenticate the token.
 * Checks the validity of the JWT token in the request header.
 * If valid, attaches the user payload to the request object.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
module.exports.authenticateToken = (req, res, next) => {
    // extract token
    const token = req.header('X-API-TOKEN');

    // if no token -> unauthorized
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    console.log("BLACKLIST:", BLACKLIST);

    // check if token blacklisted
    if (BLACKLIST.has(token)) {
        return res.status(401).json({ message: 'Token has been blacklisted.' });
    }

    // if token -> verify against JWT secret
    jwt.verify(token, jwtSecret, (err, user) => {
        // if fails return 403 status (forbidden)
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // if valid add user payload to request obj
        req.user = user;

        // Move to the next middleware or route.
        next();
    });
};

/**
 * Middleware to authorize a specific role.
 * Ensures that the user's role matches the specified role.
 * 
 * @param {string} role - The role to authorize against.
 * @returns {function} - Returns a middleware function that checks the user's role.
 */
module.exports.authorizeRole = (role) => {
    return (req, res, next) => {
        // if no match -> forbidden status (403)
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access forbidden: insufficient role.' });
        }

        next();
    };
};
