const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./Database/config');
// Connect to the database
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Hospital Management System API');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});