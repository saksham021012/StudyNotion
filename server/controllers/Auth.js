const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

//sendotp

exports.sendOTP = async (req, res) => {

    try {
        //fetch email from req body
        const { email } = req.body

        //check if user already exists

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "User already registered"
                })
        }

        //generate otp

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("Otp generated: ", otp);

        //check for unique otp

        let result = await OTP.findOne({ otp: otp })

        while (result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({ otp: otp })
        }

        const otpPayload = { email, otp };

        //create an entry for otp

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody)

        //return response successful

        return res.status(200)
            .json({
                success: true,
                message: "OTP sent successfully",
                otp,
            })

    } catch (error) {

        console.log(error);
        return res.status(500)
            .json({
                success: false,
                message: error.message,
            })


    }

}

//signup

exports.signUp = async (req, res) => {

    try {
        //data fetch from req body

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        // validate

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "All fields are required"
                })
        }

        //match both passwords

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Password and confirmPassword values do not match, please try again"
                });
        }

        //check if user exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: fasle,
                    message: "User is already registered",
                })
        }

        // Find most recent OTP stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // Validate OTP
        if (recentOtp.length === 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: 'OTP Not Found',
            });
        }

        // Get the most recent OTP object
        const otpRecord = recentOtp[0];

        if (otp.toString() !== otpRecord.otp.toString()) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }


        //hash password 

        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry in DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return res

        return res
            .status(200)
            .json({
                success: true,
                message: "User is registered successfully",
                user
            })

    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                success: false,
                message: "User cannot be registered. Please try again."
            })

    }
}

//login

exports.login = async (req, res) => {

    try {
        //get data from req body
        const { email, password } = req.body
        // validation data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required, please try again',
            });
        }

        // user check exist or not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }

        // generate JWT, after password matching

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                success: false,
                message: 'Login failure, please try again',
            })
    }
}

//change password

exports.changePassword = async (req, res) => {
    try {
        // Get data from request body
        const {oldPassword, newPassword } = req.body;
        const email = req.user.email;

        // Validate input fields
        if (!email ||  !oldPassword || !newPassword ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Compare old password with the stored hash
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect.",
            });
        }

        // Check if new password matches confirm password
        // if (newPassword !== confirmNewPassword) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "New password and confirm password do not match.",
        //     });
        // }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        // Send password update confirmation email
        await mailSender(
            email,
            "Password Changed Successfully",
        );

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while changing the password.",
        });
    }
};