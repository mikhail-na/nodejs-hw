const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/controllers');


const schemas = require("../../schemas/validateSchemas");
const {validateFunc, handleBodyChange, isValidIdFunc, authenticate} = require("../../middlewares");

router.get('/', authenticate, ctrl.getAllContacts);

router.get('/:id', authenticate, isValidIdFunc, ctrl.getById);

router.post('/', authenticate, validateFunc(schemas.addSchema), ctrl.addContact);

router.put("/:id", authenticate, isValidIdFunc, handleBodyChange, validateFunc(schemas.addUpdSchema), ctrl.updContactById);

router.patch("/:id/favorite", authenticate, isValidIdFunc, validateFunc(schemas.updFavoriteSchema), ctrl.updFavorite);

router.delete('/:id', authenticate, isValidIdFunc, ctrl.deleteContactById);



module.exports = router;
