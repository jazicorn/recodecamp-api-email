'use strict';
/* eslint-disable  @typescript-eslint/no-explicit-any */
const router = require("express").Router();
//const router = require("express-promise-router");

const user = require('../controllers/passcodes.controller');

router.post("/confirm/account", user.guestConfirmAccount);
router.post("/validate/account", user.guestValidateAccount);
router.post("/verify/account", user.guestVerifyAccount);
router.post("/password/reset", user.guestPasswordReset);

module.exports = router;

export {};
