const express = require('express');
const router = express.Router();
const coordinateController = require('../controllers/coordinate.controller');

router.post('/coordinates', coordinateController.getCoordinates);

module.exports = router;