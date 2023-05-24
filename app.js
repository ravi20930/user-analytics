require("dotenv").config();
const sequelize = require('./utils/database');
const User = require('./models/user-model');
const Location = require('./models/location-model');
const OTP = require('./models/otp-model');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();

// Middleware
app.use(morgan('dev')); // Log HTTP requests in the console
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
const authRouter = require('./routes/auth-routes');
const usersRouter = require('./routes/user-routes');

// app.use('/', authRouter);
// app.use('/users', usersRouter);

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
        const port = process.env.APP_PORT || 3000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
})();
