'use strict';

const User = require('../models/User');
const createError = require('http-errors');
const { matchedData } = require('express-validator');
const formatoResponse = require('../lib/formatoResponse');
const admin = require('../firebaseAuth/adminFirebase');

/**
 * Crea un nuevo usuario en la db, los datos del usuario
 * vienen en el body
 */
async function createOrUpdateUser(req, res, next) {
  try {
    // Comprobacion del body de User.
    const data = matchedData(req);

    const { email, address, mobile, phone, orgs } = data;

    //? Sólo el SuperAdmin puede crear o actualizar otros email de los usuarios
    if (req.userData.email !== email && req.userData.role !== 'SuperAdmin') {
      return next(createError(401, 'Forbidden'));
    }

    let usuario = await User.findOne({ email: email });

    if (!usuario) {
      if (data.role === 'NotRegistered') data.role = 'Member';
      usuario = new User(data);
    } else {
      // Si viene el objeto con las organizaciones desde el front
      // Entonces hay que actualizar la asignación en el objeto usuario
      if (!orgs || orgs.length === 0) {
        // Si el objeto viene vacío significa que se eliminan todas las asignaciones
        usuario.organizations = [];
      } else {
        const orgsFinales = [];
        orgs.map(org => {
          const orgsUsuario = usuario.organizations.filter(
            o => o._id === org.value
          );

          if (orgsUsuario.length === 0) {
            orgsFinales.push({ name: org.label, _id: org.value });
          } else {
            orgsFinales.push(orgsUsuario[0]);
          }
        });
        usuario.organizations = orgsFinales;
      }

      usuario.displayName = data.displayName;
      usuario.firstSurname = data.firstSurname;
      usuario.secondSurname = data.secondSurname;
      usuario.fiscalNumber = data.fiscalNumber;
      usuario.photoURL = data.photoURL;
      usuario.role = data.role;
    }

    if (address) usuario.contact.address = address;
    if (mobile) usuario.contact.mobile = mobile;
    if (phone) usuario.contact.homePhone = phone;
    await usuario.save();

    res
      .status(201)
      .json(formatoResponse('success', usuario, 'Usuario creado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 * Desactiva un usuario del sistema
 */
async function enableUser(req, res, next) {
  try {
    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario)
      return next(createError(500, 'El usuario NO existe en la base de datos'));

    usuario.activo = true;
    await usuario.save();

    res
      .status(200)
      .json(formatoResponse('success', user, 'Usuario activado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 * Deshabilita un usuario del sistema
 */
async function disableUser(req, res, next) {
  try {
    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario)
      return next(createError(500, 'El usuario NO existe en la base de datos'));

    usuario.activo = false;
    await usuario.save();

    res
      .status(200)
      .json(
        formatoResponse('success', user, 'Usuario deshabilitado con éxito')
      );
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 * Retorna un usuario
 */
async function getUser(req, res, next) {
  //console.log(req.userData, '<-- userdata');
  try {
    // Agrego esto para filtrar que sólo un usuario SuperAdmin puede consultar por otro usuario
    // indicando el id de mongo en el query string
    const data = matchedData(req);
    let user;
    if (data.userId) {
      if (req.userData.role !== 'Member') {
        user = await User.findById(data.userId);
      }
    } else {
      user = await User.findOne({ email: req.userData.email });
    }

    if (!user) {
      return res
        .status(200) //! Deberia devolver 200, no 404
        .json(
          formatoResponse(
            'user not found',
            '',
            'User not created',
            'NOUSERDATABASE'
          )
        );
    }

    res
      .status(200)
      .json(formatoResponse('success', user, 'Usuario activado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

async function getAllUsers(req, res, next) {
  try {
    const orgId = req.params.orgId;
    let where = {};

    if (orgId) {
      where['organizations._id'] = orgId;
    }
    const users = await User.find(where)
      .select('displayName firstSurname secondSurname email')
      .sort('displayName');
    res
      .status(200)
      .json(formatoResponse('success', users, 'Usuario activado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 *! Sólo para pruebas
 */
function listFirebaseUsers(req, res, next) {
  admin
    .auth()
    .listUsers()
    .then(users => {
      res
        .status(201)
        .json(formatoResponse('succes', users, 'Users List'))
        .end();
    });
}

/**
 *! Sólo para pruebas
 */
function deleteFirebaseUser(req, res, next) {
  const { uid } = req.body;
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      res.status(201).json(formatoResponse('succes', uid, 'Users List')).end();
    })
    .catch(err => next(createError(500, err.message)));
}

module.exports = {
  createOrUpdateUser,
  enableUser,
  disableUser,
  getUser,
  getAllUsers,
  listFirebaseUsers,
  deleteFirebaseUser,
};
