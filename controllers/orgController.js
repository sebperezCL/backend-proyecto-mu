'use strict';

const Org = require('../models/Org');
const User = require('../models/User');
const createError = require('http-errors');
const { matchedData } = require('express-validator');
const formatoResponse = require('../lib/formatoResponse');

// post crear org
// put update
// delete solo org
// get org

async function createOrUpdateOrg(req, res, next) {
  // comprobacion de coincidencia del body de org
  const data = matchedData(req);
  try {
    if (!data.orgId) {
      // Se crea una nueva organización
      const user = await User.findById(data.president);
      if (!user) return next(createError(400, 'President does not exist'));

      const org = new Org(data);
      await org.save();

      // Se debe asignar la organización creada al usuario presidente
      user.organizations.push({ name: data.name, _id: org._id });
      await user.save();

      return res
        .status(200)
        .json(
          formatoResponse('success', org, 'Organization created successfully')
        );
    } else {
      console.log(data);

      // Verifica si el presidente existe como usuario
      const user = await User.findById(data.president);
      if (!user) return next(createError(400, 'President does not exist'));

      // Actualiza la organización con los nuevos datos recibidos
      const org = await Org.findByIdAndUpdate(data.orgId, data, { new: false });

      // Buscar si el usuario tiene asignada la organización en la que
      // quedará como presidente
      const orgInUser = user.organizations.filter(
        org => org._id === data.orgId
      );

      // Si no la tiene asignada se la asigna
      if (orgInUser.length === 0) {
        user.organizations.push({ name: data.name, _id: org._id });
        await user.save();
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
    const orgs = await Org.findById(req.params._id);
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

module.exports = { createOrUpdateOrg, getAllOrgs, getOrgsById, deleteOrgsById };
