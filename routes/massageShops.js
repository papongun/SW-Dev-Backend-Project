const express = require(`express`);
const {
    getMassageShops,
    getMassageShop,
    createMassageShop,
    updateMassageShop,
    deleteMassageShop,
} = require(`../controllers/massageShops`);
const { protect, authorize } = require(`../middleware/auth`);
const appointmentRouter = require("./appointments");

const router = express.Router();

router.use("/:massageShopId/appointments/", appointmentRouter);

router
    .route(`/`)
    .get(getMassageShops)
    .post(protect, authorize("admin"), createMassageShop);
router
    .route(`/:id`)
    .get(getMassageShop)
    .put(protect, authorize("admin"), updateMassageShop)
    .delete(protect, authorize("admin"), deleteMassageShop);

module.exports = router;
