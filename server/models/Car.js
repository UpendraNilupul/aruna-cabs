const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make:        { type: String, required: true },
  model:       { type: String, required: true },
  year:        { type: Number, required: true },
  category:    { type: String, enum: ['SUV','Sedan','Hatchback','Truck'] },
  pricePerDay: { type: Number, required: true },
  image:       { type: String },      // Cloudinary URL
  available:   { type: Boolean, default: true },
  transmission:{ type: String, enum: ['Manual','Automatic'] },
  seats:       { type: Number },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);