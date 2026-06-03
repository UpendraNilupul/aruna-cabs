const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const car = await Car.findById(carId);
  if (!car || !car.available) return res.status(400).json({ message: 'Car not available' });

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalPrice = days * car.pricePerDay;

  const booking = await Booking.create({
    car: carId, user: req.user._id,
    startDate, endDate, totalPrice
  });
  car.available = false;
  await car.save();
  res.status(201).json(booking);
});

router.get('/my', protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('car');
  res.json(bookings);
});

module.exports = router;