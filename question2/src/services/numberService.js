const axios = require('axios');
require('dotenv').config();

const fetchNumbers = async (numberId) => {
  const validIds = ['p', 'f', 'e', 'r'];
  if (!validIds.includes(numberId)) {
    throw new Error('Invalid number ID');
  }

  const typeMap = {
    p: 'primes',
    f: 'fibonacci',
    e: 'even',
    r: 'rand'
  };

  const url = `${process.env.TEST_SERVER_URL}/${typeMap[numberId]}`;
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    },
    timeout: process.env.TIMEOUT_MS
  };

  try {
    const response = await axios.get(url, config);
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching ${typeMap[numberId]} numbers:`, error.message);
    return [];
  }
};

module.exports = { fetchNumbers };