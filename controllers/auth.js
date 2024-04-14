const User = require(`../models/User`);

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, telephoneNumber, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            telephoneNumber,
            role,
        });

        res.status(200).json({
            message:
                "User account has been created, dont't forget to request OTP for verifing your account.",
            _id: user._id,
            name: user.name,
            email: user.email,
            telephoneNumber: user.telephoneNumber,
            role: user.role,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Cannot create user account`,
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please provide email and password`,
            });
        }

        const user = await User.findOne({ email }).select(`+password`);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: `Invalid credentials`,
            });
        }

        const isMatched = await user.matchPassword(password);
        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: `Invalid credentials`,
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: `Please verify your email address`,
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: "Cannot convert email or password to string",
        });
    }
};

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
};

exports.logout = async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV == "production") {
        options.secure = true;
    }

    const responseMessage = "User has been logged in successfully.";

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        telephoneNumber: user.telephoneNumber,
        role: user.role,
        token,
        message: responseMessage,
    });
};
