const ContactModel = require("../models/contactDB");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAllContacts = async (req, res, next) => {
 
    const { _id: owner } = req.user;

    const result = await ContactModel.find({ owner }).populate("owner", "name email");
    res.json(result);
  
};

const getById = async (req, res, next) => {
 
    const { _id: owner } = req.user;
    const { id } = req.params;

    const result = await ContactModel.findOne({ _id: id, owner });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);

};

const addContact = async (req, res, next) => {
    const { _id: owner } = req.user;
    const body = req.body;
      
    const result = await ContactModel.create({ ...body, owner });
    
        res.status(201).json(result);
    
};

const updContactById = async (req, res, next) => {
    const { _id: owner } = req.user;
    const body = req.body;
    const { id } = req.params;
      
    const result = await ContactModel.findOneAndUpdate({ _id: id, owner }, body, { new: true });

    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
 
};

const updFavorite = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const body = req.body;

    const result = await ContactModel.findOneAndUpdate({ _id: id, owner }, body, { new: true });

    if (!result) {
      throw HttpError(400, "Missing favorite field");
    }
    res.json(result);

};
    
const deleteContactById = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { id } = req.params;

    const result = await ContactModel.findOneAndRemove({ _id: id, owner });
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json({ message: "Delete was sucssesful" });

};

module.exports = {
  getAllContacts:ctrlWrapper(getAllContacts),
  getById:ctrlWrapper(getById),
  addContact:ctrlWrapper(addContact),
  updContactById:ctrlWrapper(updContactById),
  updFavorite:ctrlWrapper(updFavorite),
  deleteContactById:ctrlWrapper(deleteContactById),
};