require('dotenv').config()
const amqplib = require('amqplib')

const amqpConnectPromise =  amqplib.connect(process.env.AMQP_URL_STRING)
const queueName = process.env.QUEUENAME;


/**
 * @description Funcion que espera un obj como parametro  
 * ejemplo =>   
 * {
 *  "to": "email@example.com",
 *  "from": "email@example.com",
 *  "templateId": "xxx-xxx-xxx",
 *  "dynamicTemplateData": {
 *    "subject": "subject",
 *    "name": "string",
 *    "name2": "string"
 *    }
 * }
 * @async @function
 * @returns If success true
 * @returns If error error 
*/

module.exports = async function sendMessage(obj) {
  try {
    const conn = await amqpConnectPromise;
    const channel = await conn.createChannel()

    await channel.assertQueue(queueName, {
      durable: true,
    });
    const state = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(obj)));
    return state
    
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    return error
  }
}

