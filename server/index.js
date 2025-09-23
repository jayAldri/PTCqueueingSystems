import express from "express";
import cors from "cors";
import history from "connect-history-api-fallback";
import path from "path";
import { fileURLToPath } from "url";

import studentRoutes from "./routes/students.js";
import queueRoutes from "./routes/queue.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Proper __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API routes
app.use("/students", studentRoutes);
app.use("/queue", queueRoutes);

// SPA fallback
app.use(
  history({
    index: "/index.html",
    disableDotRule: true,
  })
);

// Serve frontend
app.use(express.static(path.join(__dirname, "../client/dist")));

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);