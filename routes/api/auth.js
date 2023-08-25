const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateFunc, authenticate, upload } = require("../../middlewares");
const schemas = require("../../schemas/authSchema");

const router = express.Router();


router.post("/register", validateFunc(schemas.registerSchema), ctrl.register);

router.post('/login', validateFunc(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updAvatar)


module.exports = router;
