const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get('/all', userController.getAllUsers);
router.post('/default', userController.setDefaultUser);

module.exports = router
