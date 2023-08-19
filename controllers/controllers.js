const ContactModel = require("../models/contactDB");
const { HttpError } = require("../helpers");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await ContactModel.find({ owner }).populate("owner", "name email");
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await ContactModel.findById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
      
    const { _id: owner } = req.user;
      const body = req.body;
      
        const result = await ContactModel.create({...body, owner});
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

const updContactById = async (req, res, next) => {
  try {
    const body = req.body;
      const { id } = req.params;
      
    const result = await ContactModel.findByIdAndUpdate(id, body, {new:true});
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await ContactModel.findByIdAndUpdate(id, body, {new:true});

    if (!result) {
      throw HttpError(400, "Missing favorite field");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};
    
const deleteContactById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await ContactModel.findByIdAndDelete(id);
        if (!result) {
            throw HttpError(404, "Not Found");
        }
        res.json({ message: "Delete was sucssesful" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
  getAllContacts,
  getById,
  addContact,
  updContactById,
  updFavorite,
  deleteContactById,
};