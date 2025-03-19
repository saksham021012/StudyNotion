const User = require("../models/User");
const mailSender = require("../utils/mailSender.js")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        // Get email from req body
        const email = req.body.email;

        // Check if user exists with this email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Your Email is not registered with us',
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
            },
            { new: true }
        );


        // create url

        const url = `http://localhost:3000/update-password/${token}`

        // send mail containing the url
        await mailSender(email, "Password Reset link",
            `Password Reset Link: ${url}`
        );
        //return response    

        return res.json({
            success: true,
            message: 'Email sent successfully, please check email and change password'
        })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                success: false,
                message: "Something went wrong while sending reset password mail"
            })

    }

}

//resetPassword

exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body
        //valdiation
        if (password != confirmPassword) {
            return res
                .json({
                    success: false,
                    message: "Password not matching"
                })
        }
        //get user details from db using token
        const userDetails = await User.findOne({ token: token })
        //if no entry - invalid token
        if (!userDetails) {
            return res
                .json({
                    success: false,
                    message: "Token is invalid"
                })
        }
        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res
                .json({
                    success: false,
                    message: 'Token is expired, please re-generate your token'
                })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //password update
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        )
        //return response
        return res
            .status(200)
            .json({
                success: true,
                message: "Password reset successful"
            })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                success: false,
                message: "Something went wrong while sending reset password mail"
            })
    }
}