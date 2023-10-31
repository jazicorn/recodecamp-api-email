'use strict';
/* eslint-disable  @typescript-eslint/no-explicit-any */
const router = require("express").Router();
//const router = require("express-promise-router");

const index = require('../controllers/index.controller');

router.get("/", index.helloWorld)

module.exports = router;

export {};
