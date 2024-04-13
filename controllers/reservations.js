const Reservation = require("../models/Reservation");
const MassageShop = require("../models/MassageShop");

exports.getReservations = async (req, res, next) => {
    let query;

    if (req.user.role !== "admin") {
        query = Reservation.find({ user: req.user.id }).populate({
            path: "massageShop",
            select: "name address tel openTime closeTime",
        });
    } else {
        if (req.params.MassageShopId) {
            query = Reservation.find({
                massageShop: req.params.massageShopId,
            }).populate({
                path: "massageShop",
                select: "name address tel openTime closeTime",
            });
        } else {
            query = Reservation.find().populate({
                path: "massageShop",
                select: "name address tel openTime closeTime",
            });
        }
    }

    try {
        const reservations = await query;
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot find reservations",
        });
    }
};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: "massageShop",
            select: "name address tel openTime closeTime",
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            data: reservation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot find reservation",
        });
    }
};

exports.addReservation = async (req, res, next) => {
    try {
        req.body.massageShop = req.params.massageShopId;
        const massageShop = await MassageShop.findById(
            req.params.massageShopId
        );

        if (!massageShop) {
            return res.status(404).json({
                success: false,
                message: `No massage shop with the id of ${req.params.massageShopId}`,
            });
        }

        req.body.user = req.user.id;
        const existedReservation = await Reservation.find({
            user: req.user.id,
        });
        if (existedReservation.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservation`,
            });
        }

        const reservation = await Reservation.create(req.body);

        res.status(200).json({
            success: true,
            data: reservation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot create reservation",
        });
    }
};

exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`,
            });
        }

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorize to update this reservation`,
            });
        }

        reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            data: reservation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot update reservation",
        });
    }
};

exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`,
            });
        }

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorize to delete this reservation`,
            });
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot delete reservation",
        });
    }
};
