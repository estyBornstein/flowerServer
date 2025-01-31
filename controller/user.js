import { productModel } from "../models/product.js"
import { userModel } from "../models/user.js"

export async function getAllUsers(req, res) {
    try {
        let result = await userModel.find()
        if (result.lenght == 0)
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
        res.status(400).json({ title: "Failed to bring  the user by id", message: err.message })
    }
};
export async function addUser(req, res) {
    let { body } = req;
    if (!body.userName || !body.password)
        return res.status(404).json({ title: "missing data in body", message: "userName and password are required" })
    try {
        let newUser = new userModel(req.body)
        await newUser.save()
        res.json("the user added successfully")
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
        res.json(result )
    }
    catch (err) {
        res.status(400).json({ title: "Failed to update the user", message: err.message })
    }

};
export async function updatePassword(req, res) {
    let { id } = req.params
    let { password } = req.body;
    try {
        let result = await productModel.findByIdAndUpdate(id, { password: password }, { new: true })
        if (!result)
            return res.status(404).json({ title: "cannot update the password", message: "no user with such id" })
       res.json(result)

    }
    catch (err) {
        res.status(400).json({ title: "Failed to update the password", message: err.message })
    }

}
export async function login(req, res) {
    let { userName, password } = req.body
    if (!userName || !password)
        return res.status(404).json({ title: "cannot login", message: "userName and password are required" })
    try {
        let result = await userModel.findOne({ userName: userName })
        if (!result)
            return res.status(404).json({ title: "cannot login", message: "no user with such userName" })
        if (result.password != password)
            return res.status(404).json({ title: "cannot login", message: "wrong password" })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to login", message: err.message })
    }

}


