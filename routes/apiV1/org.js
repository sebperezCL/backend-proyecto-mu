const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const rolValidator = require('../../lib/middlewares/rolValidator');
const putOrgInReq = require('../../lib/middlewares/putOrgInReq');
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

router.get(
  '/fee/',
  [
    query('orgId'),
    query('year', 'Year must be a number and not empty').isNumeric().notEmpty(),
  ],
  fieldsValidator,
  rolValidator(['SuperAdmin', 'Treasurer']),
  putOrgInReq,
  orgController.getFeesOrg
);

router.post(
  '/fee/',
  [
    body('orgId'),
    body('year', 'Year must be a number and not empty').isNumeric().notEmpty(),
    body('amount', 'Amount must be a number and not empty')
      .isNumeric()
      .notEmpty(),
    body('desc'),
    body('defaultFee', 'Must indicate if is default fee').notEmpty(),
  ],
  fieldsValidator,
  rolValidator(['SuperAdmin', 'Treasurer']),
  putOrgInReq,
  orgController.setFeeOrg
);

router.post(
  '/payment',
  [
    body('orgId'),
    body('userId', 'userId must be not empty').notEmpty(),
    body('year', 'Year must be a number and not empty').isNumeric().notEmpty(),
    body('amount', 'Amount must be a number and not empty')
      .isNumeric()
      .notEmpty(),
    body('desc'),
    body('date', 'userId must be not empty').notEmpty(),
    body('dueDate'),
    body('bank'),
    body('checkNumber'),
    body('paymentMethod'),
    body('quotaYear'),
  ],
  fieldsValidator,
  rolValidator(['SuperAdmin', 'Treasurer']),
  putOrgInReq,
  orgController.setPayment
);

router.delete(
  '/payment/:year/:paymentId',
  [body('orgId')],
  fieldsValidator,
  rolValidator(['SuperAdmin', 'Treasurer']),
  putOrgInReq,
  orgController.deletePayment
);

router.get('/all', rolValidator(['SuperAdmin']), orgController.getAllOrgs);

router.get(
  '/:_id?',
  rolValidator(['SuperAdmin', 'President', 'Treasurer', 'Secretary', 'Member']),
  orgController.getOrgsById
);

router.delete(
  '/fee',

  body('orgId'),
  body('year', 'Year must be a number and not empty').isNumeric().notEmpty(),
  body('feeId', 'Fee Id must be not empty').notEmpty(),
  fieldsValidator,
  rolValidator(['SuperAdmin']),
  putOrgInReq,
  orgController.deleteFeeOrg
);

router.delete(
  '/:_id',
  rolValidator(['SuperAdmin']),
  orgController.deleteOrgsById
);

module.exports = router;
