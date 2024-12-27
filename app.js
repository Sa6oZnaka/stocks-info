const express = require('express');
const axios = require('axios');  
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());

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
    console.error('Error fetching stock data:', error);
    return null;
  }
}

// Главна страница, която показва данни за акциите
app.get('/', async (req, res) => {
  try {
    const stockDataPromises = companies.map(symbol => fetchStockData(symbol));
    const stockData = await Promise.all(stockDataPromises);

    const successfulData = stockData.filter(data => data !== null);

    let htmlContent = `
      <html>
        <head>
          <title>Current Stock Data</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Current Stock Values</h1>
          <table>
            <thead>
              <tr><th>Company</th><th>Stock Value</th><th>Market Cap</th><th>CEO</th></tr>
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
          <td>---</td>
          <td>---</td>
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
