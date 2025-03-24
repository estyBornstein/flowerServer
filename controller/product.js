import mongoose from "mongoose"
import { productModel } from "../models/product.js"
import { productValidation } from "../validations/productValidation.js";

export async function getAllFlowers(req, res) {

    let limit = req.query.limit || 8;//not working
    let page = req.query.page || 1;
    try {
        let result = await productModel.find().skip((page - 1) * limit).limit(limit)
        if (result.length == 0)
            res.json("no flowers")
        else
            res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring all the flowers", message: err.message })
    }
};
export async function getTotalCount(req, res) {
    let limit = req.query.limit;
    try {
        let result = await productModel.countDocuments();
        console.log(result)
        res.json({
            totalFlowers: result,
            pages: Math.ceil(result / limit),
            limit
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ title: "can not return total count", message: err.message })
    }
}
export async function getFlowerById(req, res) {
    console.log(req.params)

    let { id } = req.params;
    try {
        let result = await productModel.findById(id)

        if (!result)
            return res.status(404).json({ title: "Problem with the id", message: "There is no flower with such a code." })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring  the flower by id", message: err.message })
    }
};
export async function addFlower(req, res) {
    let { role } = req.user
    if (role != "ADMIN")
        return res.status(403).json("You do not have permission.")
    let { body } = req;

    if (!Array.isArray(body.existColors))
        body.existColors = [body.existColors]
    const { error } = productValidation.validate(body)
    if (error)
        return res.status(400).json({ title: "validition errors", message: error.details[0].message })
    try {
        if (req.file) { // בדיקה אם req.file קיים
            body.img = req.file.originalname; // שימוש ב-req.file.path כדי לקבל את הנתיב המלא
        } else {
            body.img = null; // או נתיב ברירת מחדל, או null אם לא הועלה קובץ
        }
        let newFlower = new productModel(body)
        await newFlower.save()
        res.json({
            message: "The flower added successfully",
            newFlower: newFlower,
        });
    }
    catch (err) {
        res.status(400).json({ title: "Failed to add the flower", message: err.message })
    }
};
export async function deleteFlowerById(req, res) {
    let { role } = req.user
    if (role != "ADMIN")
        return res.status(403).json("You do not have permission.")
    let { id } = req.params
    try {
        let result = await productModel.findByIdAndUpdate(id, { isExist: false }, { new: true })
        if (!result)
            return res.status(404).json({ title: "cannot delete by id", message: "no flower with such id" })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to delete the flower", message: err.message })
    }

};
export async function updateFlower(req, res) {
    let { role } = req.user;
    let { id } = req.params;
    let { body } = req;
    if (role != "ADMIN")
        return res.status(403).json("You do not have permission.")
    if (!Array.isArray(body.existColors))
        body.existColors = [body.existColors]
    const { error } = productValidation.validate(body)
    if (error)
        return res.status(400).json({ title: "validition errors", message: error.details[0].message })
    try {
        if (req.file) {
            body.img = req.file.originalname;
        } else {
            body.img = null;
        }
        let result = await productModel.findByIdAndUpdate(id, body, { new: true })
        if (!result)
            return res.status(404).json({ title: "cannot update this flower", message: "no flower with such id" })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to update the flower", message: err.message })
    }

}


