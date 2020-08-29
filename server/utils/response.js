module.exports.successResponse = (res, msg) => {
  const data = {
    status: 200,
    message: msg,
  };
  return res.status(200).json(data);
};

module.exports.successResponseWithData = (res, msg, data) => {
  const resData = {
    status: 200,
    message: msg,
    data,
  };
  return res.status(200).json(resData);
};

module.exports.errorResponse = (res, status, msg) => {
  const data = {
    status,
    error: msg,
  };
  return res.status(status).json(data);
};

module.exports.notFoundResponse = (res, msg) => {
  const data = {
    status: 404,
    message: msg,
  };
  return res.status(404).json(data);
};

module.exports.validationError = (res, msg) => {
  const resData = {
    status: 400,
    message: msg,
  };
  return res.status(400).json(resData);
};

module.exports.validationErrorWithData = (res, msg, data) => {
  const resData = {
    status: 400,
    message: msg,
    data,
  };
  return res.status(400).json(resData);
};

module.exports.unauthorizedResponse = (res, msg) => {
  const data = {
    status: 401,
    message: msg,
  };
  return res.status(401).json(data);
};

module.exports.customResponse = (res, status, msg) => {
  const data = {
    status,
    message: msg,
  };
  return res.status(status).json(data);
};

module.exports.customResponseWithData = (res, status, msg, data) => {
  const resData = {
    status,
    message: msg,
    data,
  };
  return res.status(status).json(resData);
};
