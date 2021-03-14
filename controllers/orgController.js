'use strict';

const Org = require('../models/Org');
const User = require('../models/User');
const createError = require('http-errors');
const { matchedData } = require('express-validator');
const formatoResponse = require('../lib/formatoResponse');

async function createOrUpdateOrg(req, res, next) {
  // comprobacion de coincidencia del body de org
  const data = matchedData(req);
  console.log(data);
  try {
    if (!data.orgId) {
      // Se crea una nueva organización
      // Por defecto, al crear una nueva organización, asigna como tesorero y secretario
      // al mismo usuario que quedó como presidente

      data.treasurer = data.president;
      data.secretary = data.president;

      const org = new Org(data);
      await org.save();

      await setOrgInUser(data.president);

      return res
        .status(200)
        .json(
          formatoResponse('success', org, 'Organization created successfully')
        );
    } else {
      // Actualiza la organización con los nuevos datos recibidos
      const org = await Org.findByIdAndUpdate(data.orgId, data, { new: false });

      await setOrgInUser(data.president);

      if (data.treasurer) {
        await setOrgInUser(data.treasurer);
      }
      if (data.secretary) {
        await setOrgInUser(data.president);
      }

      return res
        .status(200)
        .json(
          formatoResponse('success', org, 'Organization updated successfully')
        );
    }
  } catch (error) {
    console.log(error);
  }
  return next(createError(500, 'Error creating or updating the organization'));
}

async function getAllOrgs(req, res, next) {
  try {
    const orgs = await Org.find();
    res.status(200).json(formatoResponse('success', orgs, 'Exito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

async function getOrgsById(req, res, next) {
  try {
    const orgId = req.params._id || req.headers['x-orgid'];
    const orgs = await Org.findById(orgId);
    res.status(200).json(formatoResponse('success', orgs, 'Exito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

async function deleteOrgsById(req, res, next) {
  try {
    await Org.deleteOne({ _id: req.params._id });
    res.status(204).end();
  } catch (error) {
    return next(createError(500, error.message));
  }
}

async function getUsersFromOrg(req, res, next) {
  try {
    if (matchedData(req).orgId && req.userData.role !== 'SuperAdmin') {
      //? Sólo el SuperAdmin puede obtener los usuarios de cualquier organización
      return next(createError(401, 'Forbidden'));
    }
    const orgId = matchedData(req).orgId || req.headers['x-orgid'];

    if (!orgId) {
      return next(
        createError(400, 'Must indicate the orgId in header or body')
      );
    }

    const users = await User.find({ 'organizations._id': orgId });

    res.status(200).json(formatoResponse('success', users, 'Exito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

const setOrgInUser = async userId => {
  try {
    // Verifica si el presidente existe como usuario
    const user = await User.findById(userId);
    if (!user) return false;

    // Buscar si el usuario tiene asignada la organización en la que
    // quedará como presidente
    const orgInUser = user.organizations.filter(org => org._id == data.orgId);

    // Si no la tiene asignada se la asigna
    if (orgInUser.length === 0) {
      user.organizations.push({ name: data.name, _id: org._id });
      await user.save();
    }
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createOrUpdateOrg,
  getAllOrgs,
  getOrgsById,
  deleteOrgsById,
  getUsersFromOrg,
};
