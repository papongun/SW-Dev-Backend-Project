const mongoose = require(`mongoose`);

const MassageShopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, `Please add a name`],
            unique: true,
            trim: true,
            maxLength: [50, `Name cannot be more than 50 characters`],
        },
        address: {
            type: String,
            require: [true, `Please add an address`],
        },
        tel: {
            type: String,
        },
        openTime: {
            type: String,
            match: [
                /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                `Please add a valid open time (HH:MM, 00:00 to 23:59)`,
            ],
        },
        closeTime: {
            type: String,
            match: [
                /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                `Please add a valid open time (HH:MM, 00:00 to 23:59)`,
            ],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

MassageShopSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function (next) {
        await this.model(`Appointment`).deleteMany({ massageShop: this._id });
        next();
    }
);

MassageShopSchema.virtual(`appointments`, {
    ref: `Appointment`,
    localField: `_id`,
    foreignField: `massageShop`,
    justOne: false,
});

module.exports = mongoose.model(`MassageShop`, MassageShopSchema);
