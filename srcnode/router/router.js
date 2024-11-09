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
  const {
    name,
    email,
    datetime,
    phone,
    table,
    people,
    duration,
    specialRequest,
  } = req.body;

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
      duration,
      specialRequest,
    });
    await newReservation.save();
    res.json({ message: "Reservation saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving reservation" });
  }
});
router.get("/reservations", async (req, res) => {
  try {
    // Exclude deleted reservations
    const reservations = await Reservation.find({ isDeleted: false }); // Fetch all non-deleted reservations
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
});

router.delete("/reservations/:id", async (req, res) => {
  try {
    // Find the reservation by ID
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Soft delete: Mark the reservation as deleted
    reservation.isDeleted = true;
    await reservation.save();

    res.json({ message: "Reservation marked as deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting reservation" });
  }
});

router.put("/reservations/:id", async (req, res) => {
  const { name, email, phone, people, specialRequest } = req.body;
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, {
      name,
      email,
      phone,
      people,
      specialRequest,
    }, { new: true });

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: "Error updating reservation" });
  }
});
router.get("/deleted-reservations", async (req, res) => {
  try {
    const deletedReservations = await Reservation.find({ isDeleted: true });
    res.json(deletedReservations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching deleted reservations" });
  }
});

module.exports = router;
