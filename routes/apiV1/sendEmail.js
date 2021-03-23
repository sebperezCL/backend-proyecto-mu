const express = require('express');
const router = express.Router();

const sender = require('../../lib/clientEmailSender/clientEmailSender');
const formatoResponse = require('../../lib/formatoResponse')

router.post('/', async (req, res, next) => {
  try {

    if (!(Object.keys(req.body).includes('email') && Object.keys(req.body).includes('type'))) {
      res.statusCode(400).json(formatoResponse(400,'', 'Bad request', 'BADREQUEST'))
    }

    const { email, type, ...data } = req.body;

    await sender({
      to: email,
      templateId: type,
      dynamicTemplateData: data,
    });

    res.statusCode(200).end()
    
  } catch (err) {
    next(err)
    console.log('error');
  }
});

module.exports = router;
