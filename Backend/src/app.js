import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // ✅ add this

const __filename = fileURLToPath(import.meta.url); // ✅ add this
const __dirname = path.dirname(__filename); // ✅ add this

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://perplexity-2cid.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Server is running" });
});



// ✅ static files first
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

console.log(__dirname);

// ✅ catch-all LAST
app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
