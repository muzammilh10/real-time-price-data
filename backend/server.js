import express from 'express';
import mongoose from 'mongoose';
// import axios from 'axios';
import cors from 'cors';

// const dotenv = require('dotenv');
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose
  .connect(`${process.env.MONGO_DB_URI}`);

const stockSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  cap: {
    type: Number,
    required: true,
  },
  delta: {
    hour: Number,
    day: Number,
    week: Number,
    month: Number,
    quarter: Number,
    year: Number,
  },
  timestamp: { type: Date, default: Date.now },
});

const Stock = mongoose.model('Stock', stockSchema);

// Polling function
const pollData = async () => {
  try {
    const response = await fetch(new Request("https://api.livecoinwatch.com/coins/list"), {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        "x-api-key": `${process.env.API_KEY}`
      }),
      body: JSON.stringify({
        currency: "USD",
        sort: "rank",
        order: "ascending",
        offset: 0,
        limit: 5,
        meta: false,
      }),
    });
    const data = await response.json();

    await Stock.insertMany(data);

  } catch (error) {
    console.error('Error polling data:', error);
  }
};

// Poll data every few seconds
setInterval(pollData, 5000);
// await pollData()

// API endpoint to get the latest 20 entries
app.get('/api/stocks/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const stocks = await Stock.find({ code: symbol }).sort({ timestamp: -1 }).limit(20).select('cap code delta.hour delta.day delta.week delta.month rate volume');;
  const transformedData = stocks.map(item => ({
    'Coin': item.code,
    'Price': item.rate,
    "Market Cap": item.cap,
    "Volumn 24": item.volume,
    '24h' : item.delta.day,
    "Hour": item.delta.hour 
  }));
  res.json(transformedData)
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
