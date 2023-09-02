// import 
const jwt = require('jsonwebtoken');

// environmental variable for jwt secret
const jwtSecret = process.env.JWT_SECRET;

// token blacklist
const { BLACKLIST } = require('./shared.js');

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

// authorize role, chjeck user's role against specified
module.exports.authorizeRole = (role) => {
    return (req, res, next) => {
        // if no match -> forbidden status (403)
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access forbidden: insufficient role.' });
        }

        next();
    };
};
