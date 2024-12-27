require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Синхронизиране с базата данни
db.sequelize.sync()
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Stock App API!');
});

require('./routes/company.routes')(app);

// Стартиране на сървъра
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
