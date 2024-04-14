const express = require(`express`);
const dotenv = require(`dotenv`);
const cookieParser = require(`cookie-parser`);
const connectDB = require(`./config/db`);
const mongoSanitize = require(`express-mongo-sanitize`);
const hpp = require(`hpp`);
const { xss } = require(`express-xss-sanitizer`);
const rateLimit = require(`express-rate-limit`);

// Initialize express
const app = express();

// Load ENVs
dotenv.config({ path: `./config/config.env` });

// Connect DB
connectDB();

// Router files
const massageShops = require(`./routes/massageShops.js`);
const reservations = require(`./routes/reservations.js`);
const auth = require(`./routes/auth`);
const account = require(`./routes/account`);

// CORS
const cors = require("cors");
app.use(cors());

// Helmet
const helmet = require("helmet");
app.use(helmet());

// Body parser
app.use(express.json());

// Mongo Sanitize
app.use(mongoSanitize());

// Http Parameter Pollution
app.use(hpp());

// XSS Sanitizer
app.use(xss());

// Rate Limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Mount routers
app.use(`/api/v1/massageShops`, massageShops);
app.use(`/api/v1/reservations`, reservations);
app.use(`/api/v1/auth`, auth);
app.use(`/api/v1/account`, account);

const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    console.log(
        `Log: Server is running in`,
        process.env.NODE_ENV,
        `mode on port`,
        PORT
    )
);

// Cookie Parser
app.use(cookieParser());

// Handle promise rejection
process.on("unhandledRejection", (error, promise) => {
    console.log(`Error: ${error}`);
    server.close(() => process.exit(1));
});
