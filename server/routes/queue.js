import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Create queue request
router.post("/request", async (req, res) => {
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
    console.error("❌ Error in POST /queue/request:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
