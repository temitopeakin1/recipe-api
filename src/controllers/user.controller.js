const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const logger = require("..//utils/logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config")


const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // check if the email is unique , declare the variables of checkEmail
        const checkEmail =  await User.findOne({ email });

        if (checkEmail) {
            return res.status(400).json({ status: "error", message: "Email already exist!"})
        };

        //create a new user
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword", hashPassword);
        const newUser = new User ({
            fullName, email, password: hashPassword
        });
        
        await newUser.save(); // save new user created

        res.status(201).json({
            status: "success",
            message: "User registration successful",
            data: {
                fullName: newUser.fullName,
                email: newUser.email
            }
        });


    } catch (error) {
        logger.error("Error occured in the signup controller", error);
            res.status(500).json({success: "error", message:"Internal Server Error"});
    }
};


const login = async (req, res) => {
    try {
        const { email, password} = req.body;

        // check if user email exists in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid email or password"});
        }

        // check if the password is correct with the one in the DB
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ status: "error", message: "Invalid email or password"});
        };

        //generate token
        const accessToken =  await jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: 50 * 60})

        res.status(200).json({
            status: "success", 
            message: "Login Successful",
            data: {
                accessToken,
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }

            }
        })
    } catch (error) {
        logger.error("Error occured in login controller", error);
        res.status(500).json ({status: "error", message: "Internal Server Error"});
    }
}

module.exports = {
    signup, login
}