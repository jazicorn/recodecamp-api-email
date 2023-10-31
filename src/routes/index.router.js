const router = require("express").Router();
//const router = require("express-promise-router");

const index = require('../controllers/index.controller');

router.get("/", index.helloWorld)

module.exports = router;
