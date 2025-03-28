
import dotenv from 'dotenv'; // הוספתי את dotenv כדי להשתמש במשתנים סודיים כמו clientId ו-clientSecret
import passport from 'passport';
import bcrypt from 'bcryptjs'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // ייבוא הנכון של GoogleStrategy

import { check } from "../middlewares/check.js"
import { productModel } from "../models/product.js"
import { userModel } from "../models/user.js"
import { generateToken } from "../utils/jwt.js"


export const loginGoogle = async (req, res) => {

    try {
        let { email, userName } = req.body;
        console.log(email)
        let user = await userModel.findOne({ email });
        if (!user)
            return res.status(409).send("You don't exist with us.")
        let token = generateToken(user);
        console.log(user);
        res.status(201).json({ ...user.toObject(), token });
    }
    catch (err) {
        res.status(500).json({ message: "an error occurred while login with google" });
        console.log(err.message);
    }

}

export const signUpWithGoogle = async (req, res) => {

    try {
        let { email, userName } = req.body;
        let sameEmail = await userModel.findOne({ email });
        if (sameEmail)
            return res.status(409).send("your email already exists in the database, you will not be able to register with it again")
        let newUser = await userModel.create({ email, userName });
        let token = generateToken(newUser);
        console.log(newUser);
        res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            role: newUser.role,  // ודאי שיש שדה כזה במודל
            email: newUser.email,
            token
        });
    }
    catch (err) {
        res.status(500).send("an error occurred while adding a new user with google");
        console.log(err.message);
    }

}



export async function getAllUsers(req, res) {
    try {
        let result = await userModel.find()
        if (result.length == 0)
            return res.json("no users")
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring the whole users", message: err.message })
    }
};

export async function getUserById(req, res) {
    let { id } = req.params;

    try {
        let result = await userModel.findById(id)
        if (!result)
            return res.status(404).json({ title: "Problem with the id", message: "There is no user with such id." })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring the user by id", message: err.message })
    }
};
export async function login(req, res) {
    let { userName, password } = req.body
    if (!userName || !password)
        return res.status(404).json({ title: "cannot login", message: "userName  password and email are required" })

    try {
        let result = await userModel.findOne({ userName: userName })
        if (!result)
            return res.status(404).json({ title: "cannot login", message: "no user with such userName" })

        // השוואת הסיסמה המוצפנת לסיסמה שהוזנה
        const isMatch = await bcrypt.compare(password, result.password);  // השוואת הסיסמה המוצפנת

        if (!isMatch)
            return res.status(404).json({ title: "cannot login", message: "wrong password" })

        let token = generateToken(result);

        // הפיכת ה-Document לאובייקט רגיל והסרת הסיסמה
        let user = result.toObject();
        user.password = undefined;
        user.token = token;

        res.json(user);
    }
    catch (err) {
        res.status(400).json({ title: "Failed to login", message: err.message })
    }
}

export async function addUser(req, res) {
    let { body } = req;
    if (!body.userName || !body.password || !body.email)
        return res.status(404).json({ title: "missing data in body", message: "userName email and password are required" })

    try {
        let result = await userModel.findOne({ userName: body.userName });
        if (result)
            return res.status(409).json({ title: "cannot add ", message: "Such a userName already exists." })

        let sameEmail = await userModel.findOne({ email: body.email });
        if (sameEmail)
            return res.status(409).json({ title: "cannot add ", message: " mail already exists." })

        // הוספתי את הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);  // יצירת salt אקראי
        const hashedPassword = await bcrypt.hash(body.password, salt);  // הצפנת הסיסמה

        // יצירת אובייקט משתמש חדש עם הסיסמה המוצפנת
        let newUser = new userModel({
            ...body,
            password: hashedPassword  // שמירת הסיסמה המוצפנת
        });

        await newUser.save()
        let token = generateToken(newUser)  // יצירת טוקן JWT
        let { password, ...other } = newUser.toObject();  // הסרת הסיסמה לפני שליחה
        other.token = token;
        res.json(other)  // שליחת פרטי המשתמש עם הטוקן
    }
    catch (err) {
        res.status(400).json({ title: "Failed to add the user", message: err.message })
    }
};

export async function updateUser(req, res) {
    let { id } = req.params
    let { body } = req
    if (body.password)
        return res.status(404).json({ title: "can not update  password in body", message: "password cannot be changed here" })
    try {
        let result = await userModel.findByIdAndUpdate(id, body, { new: true })
        if (!result)
            return res.status(404).json({ title: "cannot update by id", message: "no user with such id" })
        res.json(result)

    }
    catch (err) {
        res.status(400).json({ title: "Failed to update the user", message: err.message })
    }

};

export async function updatePassword(req, res) {
    let id = req.user.userId;
    let { oldPassword, newPassword } = req.body;
    try {
        // חיפוש המשתמש לפי ה-ID והסיסמה הישנה
        let user = await userModel.findById(id);
        if (!user)
            return res.status(404).json({ title: "cannot update the password", message: "no user with such id" });

        // השוואת הסיסמה הישנה עם הסיסמה המוצפנת
        const isMatch = await bcrypt.compare(oldPassword, user.password);  // השוואת הסיסמה המוצפנת
        if (!isMatch)
            return res.status(400).json({ title: "cannot update the password", message: "old password is incorrect" });

        // הצפנת הסיסמה החדשה לפני שהיא נשמרת
        const salt = await bcrypt.genSalt(10);  // יצירת Salt להצפנה
        const hashedPassword = await bcrypt.hash(newPassword, salt);  // הצפנת הסיסמה החדשה

        // עדכון הסיסמה המוצפנת במסד הנתונים
        user.password = hashedPassword;
        await user.save();  // שמירה של המשתמש עם הסיסמה המוצפנת החדשה

        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        res.status(400).json({ title: "Failed to update the password", message: err.message });
    }
}

