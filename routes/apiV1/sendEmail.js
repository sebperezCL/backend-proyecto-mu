const express = require('express');
const router = express.Router();

const sender = require('../../lib/clientEmailSender/clientEmailSender');
const formatoResponse = require('../../lib/formatoResponse')

router.post('/', async (req, res, next) => {
  res.status(200).end()
/*   try {
    
    if (!(Object.keys(req.body).includes('email') && Object.keys(req.body).includes('type'))) {
      res.status(400).json(formatoResponse(400,'', 'Bad request', 'BADREQUEST'))
    }
    
    const { email, type, ...data } = req.body;
    
    console.log(process.env[type])
    await sender({
      to: email,
      templateId: process.env[type],
      dynamicTemplateData: data,
    });

    res.status(200).end()
    
  } catch (err) {
    next(err)
    console.log('error');
  } */
});

module.exports = router;
