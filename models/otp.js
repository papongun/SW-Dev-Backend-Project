const mongoose = require(`mongoose`);
const mailSender = require(`../utils/mailSender`);

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, `Please add an email`],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, `Please add a valid email`],
    },
    otp: {
        type: String,
        required: [true, `Please add an OTP`],
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // expires: 600,
    },
});

async function sendOtp(email, otp) {
    // Send OTP to email
    console.log(`Sending OTP to ${email}`);
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from Massage Reservation App",
            `<h1>Please confirm your OTP</h1>
            <p>Here is your OTP code: ${otp}</p>`
        );
        console.log(mailResponse);
    } catch (e) {
        console.log(e);
    }
}

OtpSchema.pre(`save`, async function (next) {
    console.log("New document saved to database");
    if (this.isNew) {
        await sendOtp(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model(`Otp`, OtpSchema);
