require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB Schema
const SoilDataSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

const SoilData = mongoose.model('SoilData', SoilDataSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Parse JSON bodies
app.use(express.json());

// Route to handle soil data
app.post('/soil_data/:value', async (req, res) => {
  try {
    const value = parseFloat(req.params.value);
    if (isNaN(value)) {
      return res.status(400).json({ error: 'Invalid value' });
    }

    const soilData = new SoilData({ value });
    await soilData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});