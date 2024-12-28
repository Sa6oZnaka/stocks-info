const express = require('express');
const axios = require('axios');  // За HTTP заявки
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const mysql = require('mysql2');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'stocks_db'   
});

function saveStockDataToDatabase(companyName, stockPrice) {
  const query = 'INSERT INTO stocks (company_name, stock_price) VALUES (?, ?)';
  
  connection.execute(query, [companyName, stockPrice], (err, results) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return;
    }
    console.log(`Inserted ${companyName} with stock price ${stockPrice} into the database.`);
  });
}


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

    // Записваме в базата данни
    if (latestPrice !== 'N/A') {
      console.log("Save to DB - " + companyName + " at " + latestPrice);
      saveStockDataToDatabase(companyName, parseFloat(latestPrice));
    }

    htmlContent += `
        <tr>
          <td><a href="/company/${companyName}">${companyName}</a></td>
          <td>${latestPrice}</td>
        </tr>
    `;
  });

  htmlContent += `
       </tbody>
      </table>
      <footer>
        <p>&copy; 2024 Stock Data Inc. All rights reserved.</p>
      </footer>
    </body>
  </html>
  `;

  res.send(htmlContent);

  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Error fetching stock data');
  }
});

app.get('/company/:symbol', async (req, res) => {
  const symbol = req.params.symbol; 
  try {
    const stockData = await fetchStockData(symbol);
  
    const newsData = await fetchCompanyNews(symbol);

    const companyName = stockData['Meta Data'] ? stockData['Meta Data']['2. Symbol'] : 'Unknown';
    const latestPrice = stockData['Time Series (5min)'] ? stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['4. close'] : 'N/A';

    let newsHTML = '';
    if (newsData && newsData.articles) {
      newsData.articles.forEach(article => {
        newsHTML += `
          <div class="news-item">
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.description}</p>
          </div>
        `;
      });
    }

    let htmlContent = `
      <html>
        <head>
          <title>${companyName} - Company Overview</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <div class="navbar">
            <a href="/">Home</a>
            <a href="/news">News</a>
          </div>
          <h1>${companyName} - Company Overview</h1>
          <h2>Stock Price: ${latestPrice}</h2>
          <div class="company-news">
            <h2>Latest News</h2>
            ${newsHTML}
          </div>
          <footer>
            <p>&copy; 2024 Stock Data Inc. All rights reserved.</p>
          </footer>
        </body>
      </html>
    `;

    res.send(htmlContent);

  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).send('Error fetching company data');
  }
});

async function fetchCompanyNews(symbol) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: symbol,
        apiKey: 'f5fdf1cdd17949d6ae4e321f74144f3d', 
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

app.get('/news', async (req, res) => {
  try {
    const newsData = await fetchCompanyNews('stocks');

    if (!newsData || !newsData.articles || newsData.articles.length === 0) {
      return res.status(404).send('No news available at the moment.');
    }

    let newsHTML = '';
    newsData.articles.slice(0, 20).forEach(article => {
      newsHTML += `
        <div class="news-item">
          <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
          <p>${article.description}</p>
          <small>Published on: ${new Date(article.publishedAt).toLocaleString()}</small>
        </div>
      `;
    });

    let htmlContent = `
      <html>
        <head>
          <title>Latest News</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <div class="navbar">
            <a href="/">Home</a>
            <a href="/news">News</a>
          </div>
          <h1>Latest News</h1>
          <div class="news-container">
            ${newsHTML}
          </div>
          <footer>
            <p>&copy; 2024 Stock Data Inc. All rights reserved.</p>
          </footer>
        </body>
      </html>
    `;

    res.send(htmlContent);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Error fetching news');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
