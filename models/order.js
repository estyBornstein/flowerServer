import mongoose, { Schema, model, Types } from "mongoose";

const smallFlowerScema = Schema({
    _id: { required: true, type: Types.ObjectId },
    name: String,
    color: String
})
const orderSchema = Schema({
    _id:Types.ObjectId,
    orderDate: { type: Date, default: new Date() },
    deadline: {
        type: Date, default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 7); // מוסיף 7 ימים לתאריך הנוכחי
            return date;
        },
    },
    customerCode: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    shipAddress: String,
    bouquet: [
        {
            flower: smallFlowerScema, // שימוש בסכימה פנימית
            amount: { type: Number, min: 1 }, // כמות מינימלית 1
        },
    ],
    isSent: {type:Boolean,default:false},
    sendPrice: Number,
    totalPrice: Number
})
export const orderModel = model("order", orderSchema)
