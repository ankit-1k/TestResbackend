// models/Reservation.js
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  datetime: Date, // Start time
  endTime: Date,  // End time for the booking
  phone: String,
  table: [Number], // Array of table numbers
  people: Number,
  duration:{
    type:String,
    required:true
  },
  specialRequest: String,
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Reservation", reservationSchema);
