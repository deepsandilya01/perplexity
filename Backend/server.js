import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 8000;

testAi();

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});