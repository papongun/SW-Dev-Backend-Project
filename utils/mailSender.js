const nodemailer = require("nodemailer");

const mailSender = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject,
            html: body,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (e) {
        console.log(e);
    }
};

module.exports = mailSender;
