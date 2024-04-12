const mongoose = require(`mongoose`);

const HospitalSchema = new mongoose.Schema(
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
        district: {
            type: String,
            required: [true, `Please add a district`],
        },
        province: {
            type: String,
            required: [true, `Please add a province`],
        },
        postalcode: {
            type: String,
            required: [true, `please add a postalcode`],
            maxLength: [5, `Postal code cannot be more than 5 digits`],
        },
        tel: {
            type: String,
        },
        region: {
            type: String,
            required: [true, `Please add a region`],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

HospitalSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function (next) {
        await this.model(`Appointment`).deleteMany({ hospital: this._id });
        next();
    }
);

HospitalSchema.virtual(`appointments`, {
    ref: `Appointment`,
    localField: `_id`,
    foreignField: `hospital`,
    justOne: false,
});



module.exports = mongoose.model(`Hospital`, HospitalSchema);
