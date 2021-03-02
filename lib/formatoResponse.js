/**
 * @function
 * @param {*} status 
 * @param {*} data 
 * @param {*} message 
 * @returns {}
 */

module.exports = (status, data='', message, errorCode = '') => {
  return {
    status: status,
    data: data,
    message: message,
    errorCode: errorCode,
  };
};
