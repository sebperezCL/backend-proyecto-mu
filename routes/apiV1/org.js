const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const rolValidator = require('../../lib/middlewares/rolValidator');
const orgController = require('../../controllers/orgController');

router.post(
  '/',
  [
    body('orgId', 'Indicate the id'),
    body('name', 'Indicate the name of the organization').notEmpty(),
    body('foundationDate', 'Indicate the foundation date').notEmpty(),
    body('country', 'Indicate the country').notEmpty(),
    body('city', 'Indicate the city').notEmpty(),
    body('address', 'Indicate the address').notEmpty(),
    body('province', 'Indicate the province').notEmpty(),
    body('president', 'Indicate the president').notEmpty(),
    body('treasurer'),
    body('secretary'),
    body('photoURL'),
  ],
  fieldsValidator,
  rolValidator(['SuperAdmin', 'President']),
  orgController.createOrUpdateOrg
);

router.get(
  '/users',
  [body('orgId')],
  fieldsValidator,
  rolValidator(['SuperAdmin', 'Treasurer', 'President', 'Secretary']),
  orgController.getUsersFromOrg
);

router.get('/all', rolValidator(['SuperAdmin']), orgController.getAllOrgs);

router.get('/:_id?', orgController.getOrgsById);

router.delete(
  '/:_id',
  rolValidator(['SuperAdmin']),
  orgController.deleteOrgsById
);

module.exports = router;
