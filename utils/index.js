import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db connected");
    } catch (error) {
        console.log("Db connection failed : ", error);
    }
}

export default dbConnection;

export const createJWT = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "1D"});

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
}