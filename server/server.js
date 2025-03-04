import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {v2 as cloudinary} from 'cloudinary';
import { app,server } from './utils/socket.js';
import job from './cron/cron.js';
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

connectDB()
job.start();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());

app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes)
app.use('/api/message',messageRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'/client/dist')))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','dist',"index.html"))
    })
}
server.listen(PORT, () =>console.log(`Server running on port ${PORT}`));