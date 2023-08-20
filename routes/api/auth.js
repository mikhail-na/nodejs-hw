const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateFunc, authenticate } = require("../../middlewares");
const schemas = require("../../schemas/authSchema");

const router = express.Router();


router.post("/register", validateFunc(schemas.registerSchema), ctrl.register);

router.post('/login', validateFunc(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);


module.exports = router;
