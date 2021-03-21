'use strict';

const Org = require('../models/Org');
const User = require('../models/User');
const createError = require('http-errors');
const { matchedData } = require('express-validator');
const formatoResponse = require('../lib/formatoResponse');

async function createOrUpdateOrg(req, res, next) {
  // comprobacion de coincidencia del body de org
  const data = matchedData(req);

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
    const query = Org.findById(orgId)
      .populate('president', 'displayName firstSurname secondSurname id email')
      .populate('treasurer', 'displayName firstSurname secondSurname id email')
      .populate('secretary', 'displayName firstSurname secondSurname id email');
    const {
      userData: { role },
    } = req;
    console.log(role);
    if (role === 'Member') {
      query.select('-fiscalYear');
    }
    const org = await query.exec();
    res.status(200).json(formatoResponse('success', org, 'Exito'));
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

const getFeesOrg = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const org = req.org;

    if (org) {
      const fees = org.fiscalYear.filter(fy => fy.year === parseInt(data.year));
      if (fees.length > 0) {
        return res
          .status(200)
          .json(formatoResponse('success', fees[0].feePerYear, 'Exito'));
      }

      return res.status(200).json(formatoResponse('success', [], 'Exito'));
    }
    return next(createError(400, 'Organization does not exist'));
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const setFeeOrg = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const org = req.org;

    if (org) {
      const { year, amount, desc, defaultFee } = data;
      org.setFee(year, desc, amount, defaultFee);
      await org.save();
      return res.status(200).json(formatoResponse('success', org, 'Exito'));
    }
    return next(createError(400, 'Organization does not exist'));
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const deleteFeeOrg = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const org = req.org;

    if (org) {
      const fees = org.fiscalYear.filter(fy => fy.year === parseInt(data.year));
      if (fees.length > 0) {
        fees[0].feePerYear.id(data.feeId).remove();
        await org.save();
        return res
          .status(200)
          .json(formatoResponse('success', fees[0].feePerYear, 'Exito'));
      }

      return res.status(200).json(formatoResponse('success', [], 'Exito'));
    }
    return next(createError(400, 'Organization does not exist'));
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const setPayment = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const org = req.org;

    if (org) {
      const user = await User.findById(data.userId);
      if (!user) return next(createError(400, 'User not found'));

      const paymentId = org.setPayment(data, user);
      if (paymentId) {
        user.setPayment(data, org, paymentId);
        await user.save();
        await org.save();
        return res.status(200).json(formatoResponse('success', org, 'Exito'));
      }
      return next(createError(400, 'Error inserting new payment'));
    }
    return next(createError(400, 'Organization does not exist'));
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createOrUpdateOrg,
  getAllOrgs,
  getOrgsById,
  deleteOrgsById,
  getUsersFromOrg,
  getFeesOrg,
  setFeeOrg,
  deleteFeeOrg,
  setPayment,
};
