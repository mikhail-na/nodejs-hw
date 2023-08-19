const errMsgList = {
    400: "Bad request",
    401: "Not authorized",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict",
    
}

const HttpError = (status, message = errMsgList[status]) => {
  const err = new Error(message);
  err.status = status;
  return err;
};
module.exports = HttpError;