const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./Database/config');
const adminRoutes = require('./Routes/adminRoutes');
const userRoutes = require('./Routes/userRoutes');
const adminSeed = require('./SeedData/AdminSeed');
const cors = require('cors');

adminSeed()
// Connect to the database
connectDB();

app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins, you can restrict this to specific domains
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.get('/', (req, res) => {
    res.send('Welcome to the Hospital Management System API');
});
app.use('/api/admin',adminRoutes)
app.use('/api/user',userRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});