const express = require('express')
const app = express();
require('dotenv').config();
console.log("ENV:", process.env.DB_CONNECT_STRING);
const main = require('./config/db')
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const streakRouter = require("./routes/streak");
const sheetRouter = require("./routes/sheet");
const contestRouter = require("./routes/contest");
const cors = require('cors')

// console.log("Hello")

const allowedOrigins = [
    'http://localhost:5173', 
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/streak', streakRouter);
app.use('/sheet', sheetRouter);
app.use('/contest', contestRouter);


const InitalizeConnection = async () => {
    try {

        await main();
        console.log("DB Connected");
        await redisClient.connect();
        console.log("Redis Connected");

        app.listen(process.env.PORT, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        })

    }
    catch (err) {
        console.log("Error: " + err);
    }
}


InitalizeConnection();

