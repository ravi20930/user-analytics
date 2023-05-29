import 'dotenv/config';
import sequelize from './utils/database.js';
import User from './models/user-model.js';
import Location from './models/location-model.js';
import OTP from './models/otp-model.js';
import Token from './models/token-model.js';
import UserDevice from './models/user-device-model.js';
import useragent from 'express-useragent';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// Create an instance of Express
const app = express();

// Middleware
app.use(useragent.express());
app.use(morgan('dev')); // Log HTTP requests in the console
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
// const authRouter = require('./routes/auth-routes');
import authRouter from './routes/auth-routes.js';
// import usersRouter from './routes/user-routes.js';
import { validateAuthorization } from "./utils/auth-validation.js";

app.use('/', authRouter);
app.use('/validate',validateAuthorization(), async (req, res)=> {
    return res.json({
        msg: "success"
    })
});

(async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('Database synchronized successfully.');
        const port = process.env.APP_PORT || 3000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
})();
