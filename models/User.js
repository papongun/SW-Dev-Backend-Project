const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Please add a name`],
    },
    email: {
        type: String,
        required: [true, `Please add an email`],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, `Please add a valid email`],
    },
    password: {
        type: String,
        required: [true, `Pleass add a password`],
        minlength: 6,
        select: false,
    },
    telephoneNumber: {
        type: String,
        required: [true, `Please add a telephone number`],
        unique: true,
        match: [/^0[0-9]{9}$/, `Please add a valid telephone number`],
    },
    role: {
        type: String,
        enum: [`user`, `admin`],
        default: `user`,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre(`save`, async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model(`User`, UserSchema);
