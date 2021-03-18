require('dotenv').config()
const amqplib = require('amqplib')

const amqpConnectPromise =  amqplib.connect(process.env.AMQP_URL_STRING)
const queueName = process.env.QUEUENAME;


/**
 * @description Funcion que espera un obj como parametro  
 * ejemplo =>   
 * {
 *  "to": "antunez19@gmail.com",
 *  "from": "luissanchez_1992@hotmail.com",
 *  "templateId": "d-202a80bc32aa47b79743729936807cd8",
 *  "dynamicTemplateData": {
 *    "subject": "subject",
 *    "name": "pepe",
 *    "name2": "pepe2"
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

