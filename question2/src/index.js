const express = require('express');
const NumberQueue = require('./utils/queue');
const { fetchNumbers } = require('./services/numberService');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const windowSize = parseInt(process.env.WINDOW_SIZE, 10);
const numberQueue = new NumberQueue(windowSize);

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;

  try {
    // Capture previous state
    const windowPrevState = numberQueue.getNumbers();

    // Fetch new numbers
    const newNumbers = await fetchNumbers(numberId);
    if (newNumbers.length > 0) {
      const randomNumber = newNumbers[Math.floor(Math.random() * newNumbers.length)];
      numberQueue.add(randomNumber);
    }

    // Capture current state and calculate average
    const windowCurrState = numberQueue.getNumbers();
    const avg = numberQueue.getAverage();

    // Response
    res.json({
      windowPrevState,
      windowCurrState,
      numbers: newNumbers,
      avg
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});