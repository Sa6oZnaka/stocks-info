const express = require('express');
const axios = require('axios');  // За HTTP заявки
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());

// API ключ от Alpha Vantage
const API_KEY = '9UQKA2TTIKHPLTLZ'; 

const companies = ['AAPL', 'GOOGL', 'AMZN', 'TSLA', 'MSFT', 'NFLX', 'FB', 'NVDA', 'BA', 'DIS'];

async function fetchStockData(symbol) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: API_KEY
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}

app.get('/', async (req, res) => {
  try {
    const stockDataPromises = companies.map(symbol => fetchStockData(symbol));
    const stockData = await Promise.all(stockDataPromises);

    const successfulData = stockData.filter(data => data !== null);

    let htmlContent = `
    <html>
      <head>
        <title>Current Stock Data</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="navbar">
          <a href="/">Home</a>
          <a href="/news">News</a>
        </div>
        <h1>Current Stock Values</h1>
        <table>
          <thead>
            <tr><th>Company</th><th>Stock Price</th></tr>
          </thead>
          <tbody>
  `;

  successfulData.forEach(stock => {
    const companyName = stock['Meta Data'] ? stock['Meta Data']['2. Symbol'] : 'Unknown';
    const latestPrice = stock['Time Series (5min)'] ? stock['Time Series (5min)'][Object.keys(stock['Time Series (5min)'])[0]]['4. close'] : 'N/A';

    htmlContent += `
      <tr>
        <td>${companyName}</td>
        <td>${latestPrice}</td>
      </tr>
    `;
  });

  htmlContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;

  res.send(htmlContent);

  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Error fetching stock data');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
