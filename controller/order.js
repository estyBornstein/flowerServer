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
        console.log(result.bouquet);
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring  the orders by user id", message: err.message })
    }
};
export async function addOrder(req, res) {
    let { body } = req;

    if (!body.bouquet || !body.shipAddress || !body.customerCode)
        return res.status(404).json({ title: "missing data.", message: "bouquet, shipAddress, customerCode are required" })
    try {
        let newOrder = new orderModel(req.body)
        await newOrder.save()
        console.log(newOrder.bouquet)
        res.json({ message: "The order was added successfully", newOrder });
    }
    catch (err) {
        res.status(400).json({ title: "Failed to add the order", message: err.message })
    }
};

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


