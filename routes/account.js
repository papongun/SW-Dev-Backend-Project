const express = require(`express`);
const {
    requestOtp,
    verifyAccount,
    deleteAccount,
} = require(`../controllers/account`);
const { protect } = require(`../middleware/auth`);

const router = express.Router();

router.post("/requestOtp", requestOtp);
router.post("/verifyAccount", verifyAccount);
router.delete("/deleteAccount", protect, deleteAccount);

module.exports = router;
