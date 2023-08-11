const { isValidObjectId } = require('mongoose');

const { HttpError } = require("../helpers");

const isValidIdFunc = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      HttpError(400, `${id} is not valid id`);
    }
    next();
}

module.exports = isValidIdFunc;