const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // Make sure this is set correctly
            port: 587,  // Use 465 for SSL or 587 for TLS
            secure: false, // Set to true if using port 465
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS, // Fixed the key name
            },
        });

        let info = await transporter.sendMail({
            from: `"StudyNotion || Code Saksham" <${process.env.MAIL_USER}>`, // Fixed format
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email Sent Successfully:", info);
        return info;

    } catch (error) {
        console.error("Error Sending Email:", error);
        return null; // Return null to prevent `undefined` errors
    }
};

module.exports = mailSender;
