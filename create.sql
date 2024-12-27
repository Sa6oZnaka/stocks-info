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