const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/controllers');


const schemas = require("../../schemas/validateSchemas");
const {validateFunc, handleBodyChange, isValidIdFunc} = require("../../middlewares");

router.get('/', ctrl.getAllContacts);

router.get('/:id', isValidIdFunc, ctrl.getById);

router.post('/', validateFunc(schemas.addSchema), ctrl.addContact);

router.put("/:id", isValidIdFunc, handleBodyChange, validateFunc(schemas.addUpdSchema), ctrl.updContactById);

router.patch("/:id/favorite", isValidIdFunc, validateFunc(schemas.updFavoriteSchema), ctrl.updFavorite);

router.delete('/:id',isValidIdFunc, ctrl.deleteContactById);


module.exports = router;
