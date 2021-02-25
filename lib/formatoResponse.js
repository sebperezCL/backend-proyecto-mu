/**
 * @function
 * @param {*} status 
 * @param {*} data 
 * @param {*} message 
 * @returns {}
 */

module.exports = (status, data, message) => {
  return {
    status: status,
    data: data,
    message: message,
    errorCode: '',
  };
};
