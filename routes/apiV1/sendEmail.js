const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const sender = require('../../lib/clientEmailSender/clientEmailSender');
const formatoResponse = require('../../lib/formatoResponse');
const User = require('../../models/User');

router.post('/', async (req, res, next) => {
  try {
    if (
      !(
        Object.keys(req.body).includes('email') &&
        Object.keys(req.body).includes('type')
      )
    ) {
      return next(createError(400, '', 'Bad request', 'BADREQUEST'));
    }
    console.log(req.body);

    const { email, type, ...data } = req.body;

    if (type === 'CONTACT') {
      console.log(process.env[type])
      await sender({
        to: email,
        templateId: process.env[type],
        dynamicTemplateData: data,
      });
    }


    if (type === 'ADMIN') {
      console.log(process.env[type])
      
      await sender({
        to: data.userEmail,
        templateId: process.env[type],
        dynamicTemplateData: data,
      });
    }

    res.status(200).json(formatoResponse(200, 'ok', 'ok', ''));
  } catch (err) {
    next(err);
    console.log('error');
  }
});

router.post('/treasurer-income', async (req, res, next) => {
  try {
    let result;

    if (
      !(
        Object.keys(req.body).includes('_id') &&
        Object.keys(req.body).includes('type')
      )
    ) {
      return res
        .status(400)
        .json(formatoResponse(400, 'Bad request', 'Campos erroneos', ''));
    }

    const { _id, type, ...data } = req.body;

    try {
      result = await User.findById({ _id: req.body._id });

      if (!result)
        return res
          .status(404)
          .json(
            formatoResponse(
              404,
              'User Not found ',
              'usuario NO existe en la base de datos',
              ''
            )
          );
    } catch (error) {
      res.status(500).json(formatoResponse(500, '', 'Error DB', 'ERRORDB'));
    }

    await sender({
      to: result.email,
      templateId: process.env[type],
      dynamicTemplateData: data,
    });

    res.status(200).end();
  } catch (err) {
    next(err);
    console.log('error');
  }
});

module.exports = router;
