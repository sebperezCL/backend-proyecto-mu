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
      // Se modifica organización existente
      // Comprobar si el orgId existe en la db
      // Si no existe devolver un 400 o algo así
      // Si existe entonces actualizar con información que viene en objeto data
      // guardar con org.save y retornar el nuevo objeto
      const org = await Org.findById(data.orgId);
      if (!org) {
        return next(
          createError(400, 'ID does not correspond to any organisation in DB.')
        );
      }
      console.log(org, '<-- org del Front');

      // TODO Actualizar Org...

      org.address = data.address;
      org.city = data.city;
      org.country = data.country;
      org.fiscalYear = data.fiscalYear;
      org.foundationDate = data.foundationDate;
      org.name = data.name;
      org.orgId = data.orgId;
      org.photoURL = data.photoURL;
      org.president = data.president;
      org.province = data.province;

      await org.save();

      return res
        .status(200)
        .json(
          formatoResponse('success', org, 'Organization updated successfully')
        );
    }
  } catch (error) {
    console.log(error);
  }
  return next(createError(500, 'Error creating the organization'));
}

async function getAllOrgs(req, res, next) {
  try {
    const orgs = await Org.find();
    res
      .status(200)
      .json(formatoResponse('success', orgs, 'Usuario activado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

async function getOrgsById(req, res, next) {
  try {
    const orgs = await Org.findById(req.params._id);
    res
      .status(200)
      .json(formatoResponse('success', orgs, 'Usuario activado con éxito'));
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
