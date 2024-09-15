import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import cors from 'cors';  
import dotenv from 'dotenv';
import { sequelize } from './database/models/index.js';
import userRoutes from './routes/userRoute.js';


dotenv.config();

const Port = process.env.PORT || 8022;
const app = express();

app.use(cors());  
app.use(bodyParser.json());


app.use('/user', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


const SERVER = process.env.NODE_ENV === 'production' ? https.createServer(app) : http.createServer(app);

SERVER.listen(Port, () => {
    console.log(`Server has been started successfully on port ${Port}`);
});
