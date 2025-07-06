const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./Database/config');
const adminRoutes = require('./Routes/adminRoutes');


// Connect to the database
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Hospital Management System API');
});
app.use('/api/admin',adminRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});