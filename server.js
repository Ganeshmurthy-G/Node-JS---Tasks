// server.js
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const dotenv = require("dotenv");
dotenv.config();

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

    // Run cron in master only (send one email)
    const { startCron } = require("./src/cron/cronMail");
    startCron();

} else {
    // Worker processes: handle Express app
    const express = require("express");
    const cors = require("cors");
    const cookieParser = require("cookie-parser");
    const handleConnection = require("./src/config/db"); // DB connection
    const profileRouter = require("./src/routes/profileRoute");
    const errorHandler = require("./src/middleware/globalerror");
    const verifyToken = require("./src/middleware/auth");

    const app = express();

    // Middleware
    app.use(cors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }));
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/profile", profileRouter);
    app.get("/public", (req, res) => res.json({ message: "Public route" }));
    app.get("/protected", verifyToken, (req, res) => res.json({ message: `Protected route: ${req.user.email}` }));

    // Global error handler
    app.use(errorHandler);

    // Connect DB (once per worker)
    handleConnection.connect(err => {
        if (err) console.error("DB connection error:", err);
        else console.log("DB connected successfully!");
    });

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`Worker ${process.pid} running on port ${PORT}`));
}
