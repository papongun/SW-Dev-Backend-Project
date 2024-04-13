const MassageShop = require("../models/MassageShop");

exports.getMassageShops = async (req, res, next) => {
    try {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ["select", "sort", "page", "limit"];
        removeFields.forEach((param) => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte|in)\b/g,
            (match) => `$${match}`
        );

        query = MassageShop.find(JSON.parse(queryStr)).populate(`appointments`);

        if (req.query.select) {
            const fields = req.query.select.split(",").join(" ");
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await MassageShop.countDocuments();
        query = query.skip(startIndex).limit(limit);

        const massageShops = await query;

        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        res.status(200).json({
            success: true,
            count: massageShops.length,
            pagination,
            data: massageShops,
        });
    } catch {
        console.log(error);
        res.status(400).json({
            success: false,
        });
    }
};

exports.getMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findById(req.params.id);
        if (!massageShop) {
            return res.status(400).json({
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            data: massageShop,
        });
    } catch {
        res.status(400).json({
            success: false,
        });
    }
};

exports.createMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.create(req.body);
        res.status(201).json({
            success: true,
            data: massageShop,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
        });
    }
};

exports.updateMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!massageShop) {
            res.status(400).json({
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            data: massageShop,
        });
    } catch {
        res.status(400).json({
            success: false,
        });
    }
};

exports.deleteMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findById(req.params.id);

        if (!massageShop) {
            return res.status(404).json({
                success: false,
                message: `Massage shop not found with id of ${req.params.id}`,
            });
        }

        await massageShop.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch {
        res.status(400).json({
            success: false,
        });
    }
};
