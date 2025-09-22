import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

// ✅ Database connection
const db = await mysql.createConnection({
  host: "localhost",        // change if needed
  user: "root",             // your MariaDB/MySQL username
  password: "", 
  database: "ptcqueueingsystems"         // make sure this DB exists
});

// ✅ Test route
// app.get("/students", (req, res) => {
//   const { full_name, course, year_level, email, contact_number } = req.body;

//   const sql = "INSERT INTO studetn"
//   res.send("PTC Queueing System backend is running ✅");
// });

// OLD CODE for reffrences // ✅ Queue request route
// app.post("/queue/request", async (req, res) => {
//   const { studentID, serviceType } = req.body;

//   // generate queue number
//   const [rows] = await db.query(
//     "SELECT COUNT(*) as count FROM QueueTransaction WHERE ServiceType = ?",
//     [serviceType]
//   );
//   const queueNumber = rows[0].count + 1;

//   // save to DB
//   const [result] = await db.query(
//     "INSERT INTO QueueTransaction (StudentID, QueueNumber, ServiceType, Status) VALUES (?, ?, ?, 'Pending')",
//     [studentID, queueNumber, serviceType]
//   );

//   res.json({ queueNumber, transactionID: result.insertId });
// });

app.post("/queue/request", async (req, res) => {
  const { studentID, serviceType } = req.body;

  try {
    // generate queue number
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM queuetransaction WHERE ServiceType = ?",
      [serviceType]
    );
    const queueNumber = rows[0].count + 1;

    // save to DB
    const [result] = await db.query(
      "INSERT INTO queuetransaction (StudentID, QueueNumber, ServiceType, Status) VALUES (?, ?, ?, 'Pending')",
      [studentID, queueNumber, serviceType]
    );

    res.json({
      message: "Queue request created successfully ✅",
      queueNumber,
      transactionID: result.insertId
    });
  } catch (err) {
    console.error("❌ Error in /queue/request:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// ✅ Add new student
app.post("/students", async (req, res) => {
  const { StudentID, full_name, course, year_level, email, contact_number } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO student (StudentID, full_name, course, year_level, email, contact_number) VALUES (?, ?, ?, ?, ?)",
      [StudentID, full_name, course, year_level, email, contact_number]
    );

    res.json({ 
      message: "Student registered successfully ✅", 
      student_id: result.insertId 
    });
  } catch (err) {
    console.error("❌ Error in /student:", err);
    res.status(500).json({ error: "Database error" });
  }
});



app.listen(5000, () => console.log(`✅ Server running at http://localhost:5000${PORT}`));
