'use strict';

const Org = require('../models/Org');
const createError = require('http-errors');
const { matchedData } = require('express-validator');
const formatoResponse = require('../lib/formatoResponse');

// post crear org
// put update
// delete solo org

// get org

async function createOrUpdateOrg(req, res, next) {
  const data = matchedData(req);
  console.log(data);
  res
    .status(200)
    .json(
      formatoResponse('success', req.body, 'Organización creada con éxito')
    );
}

module.exports = { createOrUpdateOrg };
