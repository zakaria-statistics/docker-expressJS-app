const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");

let RedisStore = require("connect-redis").default;

let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
    socket: {
        connectTimeout: 10000, // Increase to 10 seconds
    },
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        
        // Initialize Express app only after successful connection 
        const app = express();
        
        app.use(express.json());
        
        const cors = require("cors");
        require('dotenv').config();  // Load environment variables from .env file
        
        const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
        console.log("mongo => ", mongoUrl)
        const connectWithRetry = () => {
            mongoose
                .connect(mongoUrl, {
                    useNewUrlParser: true,    // Parse MongoDB connection URL
                    useUnifiedTopology: true, // Use the new connection engine
                    retryWrites: true         // Automatically retry write operations
                })
                .then(() => console.log("Successfully connected to DB"))
                .catch((e) => {
                    console.log("Error connecting to DB => ", e.message);
                    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
                });
        };
        
        if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_IP || !MONGO_PORT) {
            console.error("Missing MongoDB environment variables. Please check MONGO_USER, MONGO_PASSWORD, MONGO_IP, and MONGO_PORT.");
            process.exit(1);  // Exit if any variable is missing
        } else {
            connectWithRetry();  // Start the connection retry loop
        }
        
        app.use(cors({}));
        
        // Session middleware
        try {
            app.enable("trust proxy");
            app.use(session({
                store: new RedisStore({ client: redisClient }),
                secret: SESSION_SECRET,
                saveUninitialized: false,
                resave: false,
                cookie: {
                    secure: false, // Set to true in production with HTTPS
                    httpOnly: true,
                    maxAge: 60000,
                },
            }));
        } catch (error) {
            console.error('Session middleware error:', error);
        }
        
        app.get("/api/v1", (req, res) => {
            res.send("<h2>Hi There</h2>");
            console.log("hi, it ran here");
        });
        
        const postRouter = require("./routes/postRoutes");
        const userRouter = require("./routes/userRoutes");
        
        app.use("/api/v1/posts", postRouter);
        app.use("/api/v1/users", userRouter);
        app.get("/api/v1/check-session", (req, res) => {
            res.json({ session: req.session });
        });
        
        
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Listening on port ${port}`));
        
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
