const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, available } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (available) filter.available = available === 'true';
  if (minPrice || maxPrice) filter.pricePerDay = {};
  if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
  if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  const cars = await Car.find(filter);
  res.json(cars);
});

router.get('/:id', async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

// Admin only — create, update, delete
router.post('/', protect, adminOnly, async (req, res) => {
  const car = await Car.create(req.body);
  res.status(201).json(car);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(car);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: 'Car deleted' });
});

module.exports = router;