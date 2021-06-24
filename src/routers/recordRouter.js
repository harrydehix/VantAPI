const express = require("express");
const controller = require("../controllers/recordController");

const router = express.Router();

router
    .route("/")
    .get(controller.getAllRecords)
    .post(controller.createRecord)
    .delete(controller.deleteAllRecords);

router.get("/most-recent", controller.getMostRecentRecords);

router
    .route("/:id")
    .get(controller.getRecord)
    .patch(controller.updateRecord)
    .delete(controller.deleteRecord);

module.exports = router;
