module.exports = (app) => {
  const companies = require('../controllers/company.controller');
  const router = require('express').Router();

  router.post('/', companies.create);
  router.get('/', companies.findAll);
  router.get('/:id', companies.findOne);
  router.put('/:id', companies.update);
  router.delete('/:id', companies.delete);

  app.use('/api/companies', router);
};
