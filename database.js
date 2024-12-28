const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'stocks_db'
});

function getCompaniesAndLatestPrices() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          c.id,
          c.name,
          c.symbol,
          s.stock_price
      FROM 
          companies c
      JOIN 
          (
              SELECT company_name, MAX(last_updated) AS latest_update
              FROM stocks
              GROUP BY company_name
          ) latest_stock
      ON 
          c.symbol = latest_stock.company_name
      JOIN 
          stocks s 
      ON 
          s.company_name = latest_stock.company_name AND s.last_updated = latest_stock.latest_update
      ORDER BY 
          c.name;
    `;
    
    connection.execute(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getCompanyInfo(symbol) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
            c.id,
            c.name,
            c.symbol,
            c.industry,
            c.marketCap,
            c.ceo,
            c.headquarters,
            s.stock_price
        FROM 
            companies c
        JOIN 
            (
                SELECT company_name, MAX(last_updated) AS latest_update
                FROM stocks
                GROUP BY company_name
            ) latest_stock
        ON 
            c.symbol = latest_stock.company_name
        JOIN 
            stocks s 
        ON 
            s.company_name = latest_stock.company_name AND s.last_updated = latest_stock.latest_update
        WHERE c.symbol = ?;
      `;
      
      connection.execute(query, [symbol], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
}

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

module.exports = { connection, getCompaniesAndLatestPrices, saveStockDataToDatabase, getCompanyInfo };
