const db = require('../models');
const Company = db.Company;

// Създаване на компания
exports.create = (req, res) => {
  if (!req.body.name || !req.body.symbol) {
    return res.status(400).send({ message: "Name and symbol are required!" });
  }

  const company = {
    name: req.body.name,
    symbol: req.body.symbol,
    stockValue: req.body.stockValue || 0.0,
    industry: req.body.industry || null,
    marketCap: req.body.marketCap || null,
    ceo: req.body.ceo || null,
    headquarters: req.body.headquarters || null,
  };

  Company.create(company)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Извличане на всички компании
exports.findAll = (req, res) => {
  Company.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Извличане на една компания по ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  Company.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Company not found!" });
      }
      res.send(data);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

// Ъпдейтване на компания
exports.update = (req, res) => {
  const id = req.params.id;
  Company.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Company updated successfully." });
      } else {
        res.send({ message: "No company found or nothing to update." });
      }
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

// Изтриване на компания
exports.delete = (req, res) => {
  const id = req.params.id;
  Company.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Company deleted successfully." });
      } else {
        res.send({ message: "No company found!" });
      }
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
