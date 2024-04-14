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
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180,
    },
});

async function sendMail(email, otp) {
    // Send OTP to email
    console.log(`Sending OTP to ${email}`);
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from Massage Reservation App",
            `<h1>Please confirm your OTP</h1>
            <p>Here is your OTP code: ${otp}</p>
            <p>The code will expire in 3 minutes. If the code doesn't work, try to request the code again.</p>`
        );
        console.log(mailResponse);
    } catch (e) {
        console.log(e);
    }
}

OtpSchema.pre(`save`, async function (next) {
    if (this.isNew) {
        await sendMail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model(`Otp`, OtpSchema);
