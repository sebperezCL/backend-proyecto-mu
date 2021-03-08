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
  const data = matchedData(req);
  try {
    if (!data.orgid) {
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

module.exports = { createOrUpdateOrg, getAllOrgs };
