import { orderModel } from "../models/order.js"

export async function getAllOrders(req, res) {
    try {
        let result = await orderModel.find()
        if (result.lenght == 0)
            res.json("no orders")
        else
            res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring all the orders", message: err.message })
    }
};
export async function getOrderByUserId(req, res) {
    let { id } = req.params;
    try {
        let result = await orderModel.find({ customerCode: id })
        if (!result)
            return res.status(404).json({ title: "Problem with the user id", message: "we dont have orders for this id" })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring  the orders by user id", message: err.message })
    }
};
export async function addOrder(req, res) {
    let { body } = req;
    if (body.totalPrice || body.sendPrice)
        return res.status(404).json({ title: "There is a problem with the data.", message: "totalPrice,sendPrice Receives automatic value" })
    if (!body.bouquet || !body.shipAddress || body.customerCode)
        return res.status(404).json({ title: "missing data.", message: "bouquet, shipAddress, customerCode are required" })
    // try {
    //     let newOrder = new orderModel(req.body)
    //     await newOrder.save()
    //     res.json("the order added successfully", { newOrder })
    // }
    
    // catch (err) {
    //     res.status(400).json({ title: "Failed to add the order", message: err.message })
    // }
    try {
        // שליפת מזהי הפרחים מההזמנה
        const flowerIds = body.bouquet.map((item) => item.flower._id);

        // שליפת מחירי הפרחים מהמסד
        const flowers = await productModel.find({ _id: { $in: flowerIds } });

        if (flowers.length !== flowerIds.length)
            return res.status(404).json({
                title: "Invalid bouquet data",
                message: "Some flowers in the bouquet do not exist",
            });

        // חישוב סכום ההזמנה
        let totalPrice = 0;
        body.bouquet.forEach((item) => {
            const flower = flowers.find((f) => f._id.equals(item.flower._id));
            if (flower) {
                totalPrice += flower.price * item.amount;
            }
        });

        // חישוב עלות המשלוח לפי כמות הפרחים
        const totalFlowers = body.bouquet.reduce((sum, item) => sum + item.amount, 0);
        const sendPrice = totalFlowers * 5; // נניח שמחיר המשלוח הוא 5 ש"ח לכל פרח

        // יצירת הזמנה חדשה עם הערכים המחושבים
        const newOrder = new orderModel({
            ...body,
            totalPrice,
            sendPrice,
        });

        await newOrder.save();
        res.json({ message: "The order added successfully", newOrder });
    } catch (err) {
        res.status(400).json({ title: "Failed to add the order", message: err.message });
    }
}
export async function deleteOrderById(req, res) {
    let { id } = req.params
    try {
        let result = await orderModel.findById(id)
        if (!result)
            return res.status(400).json({ title: "cannot delete by id", message: "no order with such id" })
        if (result.isSent)
            return res.status(400).json({ title: "cannot delete this order", message: "You cannot delete an order that has already been placed." })
        await result.remove();
        return res.status(200).json({ title: "Order deleted", message: "The order was deleted successfully." });
    }
    catch (err) {
        res.status(400).json({ title: "Failed to delete this order", message: err.message })
    }

};
export async function updateOrder_sent(req, res) {
    let { id } = req.params

    try {
        let result = await productModel.findByIdAndUpdate(id, { isSent: true }, { new: true })
        if (!result)
            return res.status(404).json({ title: "cannot update this order", message: "no order with such id" })
    }
    catch (err) {
        res.status(400).json({ title: "Failed to update the order", message: err.message })
    }

}


