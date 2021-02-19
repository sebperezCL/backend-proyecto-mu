module.exports = (status, data, message) => {
  return {
    status: status,
    data: data,
    message: message,
    errorCode: '',
  };
};
