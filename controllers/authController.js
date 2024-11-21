const User = require("../models/userModel")
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const {username, password} = req.body;
    const hashpassword = await bcrypt.hash(password, 12);
    try {
        const newUser = await User.create({
            username,
            password: hashpassword
        });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (error) {
        console.log("error => ",error)
        res.status(400).json({
            status: "fail",
        })   
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect username or password!"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect username or password"
            });
        }
        res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            data: {
                user
            }
        });
    } catch (error) {
        console.log("error => ", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred during login"
        });
    }
};