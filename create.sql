-- Създаване на базата данни
CREATE DATABASE stocks_db;

-- Използване на новата база данни
USE stocks_db;

-- Създаване на таблицата `companies`
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL UNIQUE,
    stockValue FLOAT NOT NULL,
    industry VARCHAR(255),
    marketCap BIGINT,
    ceo VARCHAR(255),
    headquarters VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    stock_price DECIMAL(10, 2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO companies (name, symbol, stockValue, industry, marketCap, ceo, headquarters)
VALUES
('Apple Inc.', 'AAPL', 0, 'Technology', 2500000000000, 'Tim Cook', 'Cupertino, California'),
('Google LLC', 'GOOGL', 0, 'Technology', 1800000000000, 'Sundar Pichai', 'Mountain View, California'),
('Amazon.com Inc.', 'AMZN', 0, 'E-commerce', 1600000000000, 'Andy Jassy', 'Seattle, Washington'),
('Tesla Inc.', 'TSLA', 0, 'Automotive', 800000000000, 'Elon Musk', 'Palo Alto, California'),
('Microsoft Corporation', 'MSFT', 0, 'Technology', 2200000000000, 'Satya Nadella', 'Redmond, Washington'),
('Netflix Inc.', 'NFLX', 0, 'Entertainment', 200000000000, 'Reed Hastings', 'Los Gatos, California'),
('Meta Platforms Inc.', 'META', 0, 'Technology', 850000000000, 'Mark Zuckerberg', 'Menlo Park, California'),
('NVIDIA Corporation', 'NVDA', 0, 'Technology', 800000000000, 'Jensen Huang', 'Santa Clara, California'),
('Boeing Co.', 'BA', 0, 'Aerospace', 200000000000, 'David L. Calhoun', 'Chicago, Illinois'),
('The Walt Disney Company', 'DIS', 0, 'Entertainment', 300000000000, 'Bob Chapek', 'Burbank, California');