const User = require(`../models/User`);
const Otp = require(`../models/otp`);
const otpGenerator = require(`otp-generator`);

exports.requestOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const validEmail = await User.findOne({ email });
        if (!validEmail) {
            return res.status(400).json({
                success: false,
                message: `Register your email first`,
            });
        }

        const otpCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const checkEmail = await Otp.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                success: false,
                message: `You have requested an OTP code before, please check your email`,
            });
        }

        const otpResults = await Otp.create({
            email,
            otp: otpCode,
        });

        if (!otpResults) {
            return res.status(400).json({
                success: false,
                message: `Cannot create OTP code`,
            });
        }

        otpResults.otp = undefined;

        return res.status(200).json({
            success: true,
            data: otpResults,
            message:
                "OTP code sent to email, the following code will expire in 3 minutes",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
        });
    }
};

exports.verifyAccount = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const otpResults = await Otp.findOne({ email, otp });

        if (!otpResults) {
            return res.status(400).json({
                success: false,
                message: `Invalid email or OTP code`,
            });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true }
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `Cannot verify user account`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Account verified successfully, now you can login with this account`,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

exports.deleteAccount = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findById(req.user.id);
    if (user.email !== email) {
        return res.status(401).json({
            success: false,
            message: `User ${req.user.id} is not authorize to delete this account.`,
        });
    }

    const checkOtp = await Otp.findOne({ email });
    if (!checkOtp) {
        return res.status(400).json({
            success: false,
            message: `Please request an OTP code first`,
        });
    }
    if (checkOtp.otp !== otp) {
        return res.status(400).json({
            success: false,
            message: `Invalid OTP code`,
        });
    }

    await user.deleteOne();

    return res.status(200).json({
        success: true,
        message: `Account with the email ${email} has been deleted successfully.`,
    });
};
