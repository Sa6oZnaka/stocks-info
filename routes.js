const express = require('express');
const router = express.Router();
const { getCompaniesAndLatestPrices, getCompanyInfo } = require('./database');
const { fetchStockData, fetchCompanyNews } = require('./api');

// Начална страница
router.get('/', async (req, res) => {
  try {
    const companies = await getCompaniesAndLatestPrices();

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

    companies.forEach(company => {
      htmlContent += `
        <tr>
          <td><a href="/company/${company.symbol}">${company.name}</a></td>
          <td>${company.stock_price}</td>
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

// Страница за компания
router.get('/company/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {

    const companyInfo = await getCompanyInfo(symbol);
    //const stockData = await fetchStockData(symbol);
    const newsData = await fetchCompanyNews(symbol);

    const info = companyInfo[0];

    const companyName = info.name || 'Unknown';
    const latestPrice = info.stock_price || 'N/A';
    const industry = info.industry || 'N/A';
    const marketCap = info.marketCap ? formatMarketCap(info.marketCap) : 'N/A';
    const ceo = info.ceo || 'N/A';
    const headquarters = info.headquarters || 'N/A';

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
          <h2>Stock Price: ${latestPrice}</h2>
          <h2><strong>Industry:</strong> ${industry}</h2>
          <h2><strong>Market Cap:</strong> ${marketCap}</h2>
          <h2><strong>CEO:</strong> ${ceo}</h2>
          <h2><strong>Headquarters:</strong> ${headquarters}</h2>
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

function formatMarketCap(marketCap) {
    if (marketCap >= 1e12) {
      return (marketCap / 1e12).toFixed(2) + ' Trillion';
    } else if (marketCap >= 1e9) {
      return (marketCap / 1e9).toFixed(2) + ' Billion';
    } else if (marketCap >= 1e6) {
      return (marketCap / 1e6).toFixed(2) + ' Million';
    }
    return marketCap;
  }

// Новини
router.get('/news', async (req, res) => {
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

module.exports = router;
