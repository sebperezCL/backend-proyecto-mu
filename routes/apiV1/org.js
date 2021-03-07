const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const rolValidator = require('../../lib/middlewares/rolValidator');
const { createOrUpdateOrg } = require('../../controllers/orgController');

router.post(
  '/',
  [
    body('orgid', 'Indicate the id').notEmpty(),
    body('displayName', 'Indicate the name of the organization').notEmpty(),
    body('foundation', 'Indicate the foundation date').notEmpty(),
    body('country', 'Indicate the country').notEmpty(),
    body('city', 'Indicate the city').notEmpty(),
    body('address', 'Indicate the address').notEmpty(),
    body('province', 'Indicate the province').notEmpty(),
    body('president', 'Indicate the president').notEmpty(),
    body('photoURL'),
  ],
  fieldsValidator,
  rolValidator(['SuperAdmin']),
  createOrUpdateOrg
);

module.exports = router;
