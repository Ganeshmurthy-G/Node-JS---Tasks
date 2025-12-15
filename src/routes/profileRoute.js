const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
const verifyToken = require('../middleware/auth');

// Public routes
router.get('/', profileController.getProfiles);
router.get('/:id', profileController.getUserById);

// Protected routes
router.post('/', verifyToken, profileController.createUser);
router.put('/:id', verifyToken, profileController.updateUser);
router.patch('/:id', verifyToken, profileController.patchUpdateUser);
router.delete('/:id', verifyToken, profileController.deleteUser);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const profileController = require("../controller/profileController");

// router.get("/", profileController.getProfiles);
// router.get("/:id", profileController.getUserById);
// router.post("/", profileController.createUser);
// router.put("/:id", profileController.updateUser);
// router.delete("/:id", profileController.deleteUser);
// router.patch("/:id", profileController.updatePatchUser);

// module.exports = router;
