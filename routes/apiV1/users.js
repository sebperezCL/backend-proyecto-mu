var express = require('express');
var router = express.Router();
const { body } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const userController = require('../../controllers/usersController');

//! FALTA AGREGAR LOS MIDDLEWARES DE AUTENTICACION y ROLES

router.post(
  '/',
  [
    body('uidFirebase', 'Debe indicar el id del usuario').notEmpty(),
    body('email', 'Debe indicar el email del usuario').notEmpty(),
    body('nombres', 'Debe indicar los nombres del usuario').notEmpty(),
    body(
      'apellidoPaterno',
      'Debe indicar el apellido paterno del usuario'
    ).notEmpty(),
    body('apellidoMaterno').isString(),
    body(
      'fiscalId',
      'Debe indicar el identificador fiscal del usuario'
    ).notEmpty(),
  ],
  fieldsValidator,
  userController.createUser
);

router.put('/enable', [
  body('email', 'Debe indicar el email del usuario').notEmpty(),
  fieldsValidator,
  userController.enableUser,
]);

router.put('/disable', [
  body('email', 'Debe indicar el email del usuario').notEmpty(),
  fieldsValidator,
  userController.disableUser,
]);

module.exports = router;
