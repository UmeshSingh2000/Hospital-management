const jwt = require('jsonwebtoken');
const AuthenticateToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Access token is required' });
        }
        const isValid = jwt.verify(token,process.env.JWT_SECRET);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid access token' });
        }
        req.user = isValid
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized access' });
    }
}

module.exports = AuthenticateToken;