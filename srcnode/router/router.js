const express = require("express");
const Reservation = require("../schema/Reservation");
const router = express.Router();
router.post("/", async (req, res) => {});

router.get("/check-availability", async (req, res) => {
  const { datetime, duration } = req.query; // Fetch from query params

  const startTime = new Date(datetime);
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + parseInt(duration)); // Add duration in hours

  try {
    // Find reservations that overlap with the chosen time slot
    const reservations = await Reservation.find({
      $or: [
        {
          datetime: { $lt: endTime }, // Reservation starts before new booking ends
          endTime: { $gt: startTime }, // Reservation ends after new booking starts
        },
      ],
    });

    // Collect all booked table numbers for overlapping reservations
    const bookedTables = reservations.reduce((tables, resv) => {
      return tables.concat(resv.table);
    }, []);

    res.json({ bookedTables });
  } catch (error) {
    console.error("Error checking table availability", error);
    res.status(500).json({ error: "Error checking table availability" });
  }
});

// Create reservation route (POST request)
router.post("/reservations", async (req, res) => {
  const { name, email, datetime, phone, table, people, duration, specialRequest } = req.body;

  const startTime = new Date(datetime);
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + parseInt(duration));

  try {
    const newReservation = new Reservation({
      name,
      email,
      datetime: startTime,
      endTime, // Save end time for future comparisons
      phone,
      table,
      people,
      specialRequest,
    });
    await newReservation.save();
    res.json({ message: "Reservation saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving reservation" });
  }
});
module.exports = router;
