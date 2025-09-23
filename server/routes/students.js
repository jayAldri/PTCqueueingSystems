import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Middleware to check email format
function validateOfficialEmail(req, res, next) {
  const { email } = req.body;
  if (!email.endsWith("@paterostechnologicalcollege.edu.ph")) {
    return res.status(400).json({ error: "Email must end with @paterostechnologicalcollege.edu.ph" });
  }
  next();
}

// Create student
router.post("/", validateOfficialEmail, async (req, res) => {
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
    console.error("❌ Error in POST /students:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get student profile
router.get("/:StudentID", async (req, res) => {
  const { StudentID } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM student WHERE StudentID = ?", [StudentID]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error in GET /students/:StudentID:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;