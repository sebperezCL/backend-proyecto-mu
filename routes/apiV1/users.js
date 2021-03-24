const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const rolValidator = require('../../lib/middlewares/rolValidator');
const usersController = require('../../controllers/usersController');

/**
 * @description
 * GET / middleware rolvalitor con roles admitidos
 * Obtiene un Usuario filtrando por el email
 * Email incluido en req
 */
router.get(
  '/',
  [query('userId')],
  fieldsValidator,
  rolValidator([
    'SuperAdmin',
    'Treasurer',
    'President',
    'Secretary',
    'Member',
    'NotRegistered',
  ]),
  usersController.getUser
);

router.get(
  '/all/:orgId?',
  rolValidator(['SuperAdmin', 'Treasurer', 'President', 'Secretary']),
  usersController.getAllUsers
);

router.post(
  '/',
  [
    body('uid', 'Indicate the user id'),
    body('email', "Indicate the user's email address").notEmpty(),
    body('displayName', 'Indicate the names of the user').notEmpty(),
    body('firstSurname', 'Indicate the first surname of the user').notEmpty(),
    body('secondSurname'),
    body('role'),
    body('fiscalNumber', "Indicate the user's fiscal id").notEmpty(),
    body('address'),
    body('mobile'),
    body('phone'),
    body('photoURL'),
    body('orgs'),
  ],
  fieldsValidator,
  rolValidator([
    'SuperAdmin',
    'Treasurer',
    'President',
    'Secretary',
    'Member',
    'NotRegistered',
  ]),
  usersController.createOrUpdateUser
);

router.put('/enable', [
  body('email', "Indicate the user's email address").notEmpty(),
  fieldsValidator,
  usersController.enableUser,
]);

router.put('/disable', [
  body('email', "Indicate the user's email address").notEmpty(),
  fieldsValidator,
  usersController.disableUser,
]);

/**
 *! Sólo para pruebas
 */
//router.get('/list', listFirebaseUsers);

/**
 *! Sólo para pruebas
 */
// recoger url params uid user
// solo borrar si en mongo no hay usuario
/*router.delete(
  '/',
  [body('uid', 'Indicate firebase uid to delete')],
  fieldsValidator,
  deleteFirebaseUser
);*/

module.exports = router;
