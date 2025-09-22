import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import history from "connect-history-api-fallback";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ✅ Proper __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ DB connection
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ptcqueueingsystems",
});

// ✅ API routes
app.post("/queue/request", async (req, res) => {
  const { studentID, serviceType } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM queuetransaction WHERE ServiceType = ?",
      [serviceType]
    );
    const queueNumber = rows[0].count + 1;

    const [result] = await db.query(
      "INSERT INTO queuetransaction (StudentID, QueueNumber, ServiceType, Status) VALUES (?, ?, ?, 'Pending')",
      [studentID, queueNumber, serviceType]
    );

    res.json({
      message: "Queue request created successfully ✅",
      queueNumber,
      transactionID: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error in /queue/request:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Student route
app.post("/students", async (req, res) => {
  const { StudentID, full_name, course, year_level, email, contact_number } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO student (StudentID, full_name, course, year_level, email, contact_number) VALUES (?, ?, ?, ?, ?, ?)",
      [StudentID, full_name, course, year_level, email, contact_number]
    );

    res.json({
      message: "Student registered successfully ✅",
      student_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error in /students:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Add SPA fallback BEFORE static
app.use(
  history({
    index: "/index.html", // React build entry
    disableDotRule: true,
  })
);

// ✅ Serve React build
app.use(express.static(path.join(__dirname, "../client/dist")));

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
