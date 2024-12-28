const axios = require('axios');

const API_KEY_ALPHA_VANTAGE = process.env.ALPHA_VANTAGE_API_KEY;
const API_KEY_NEWSAPI = process.env.NEWS_API_KEY;

async function fetchStockData(symbol) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: API_KEY_ALPHA_VANTAGE
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}

async function fetchCompanyNews(symbol) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: symbol,
        apiKey: API_KEY_NEWSAPI,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

module.exports = { fetchStockData, fetchCompanyNews };
