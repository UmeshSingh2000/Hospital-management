const isAdmin = (req, res, next) => {
    try {
        const user = req.user; // Assuming user is set in the request by a previous middleware

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
module.exports = isAdmin;