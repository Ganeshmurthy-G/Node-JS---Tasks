const express = require('express');
const router = express.Router();
const profileController = require("../controller/profileController");

router.get("/", profileController.getProfiles);
router.get("/:id", profileController.getUserById);
router.post("/", profileController.createUser);
router.put("/:id", profileController.updateUser);
router.delete("/:id", profileController.deleteUser);
router.patch("/:id", profileController.updatePatchUser);

module.exports = router;
