const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((e) => {
      if (e.res) {
        e.status = e.res.status;
      }
      next(e);
    });
  };
};

module.exports = catchErrors;
