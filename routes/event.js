const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event");

router.post('/get', eventController.getAllEvents);
router.post('/month', eventController.getMonthEvents);
router.post('/yearly', eventController.getYearlyEvents);
router.post('/add', eventController.addEvent);
router.post('/update', eventController.updateEvent);
router.delete('/delete', eventController.deleteEvent);

module.exports = router
