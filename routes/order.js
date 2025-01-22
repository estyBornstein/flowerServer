import {Router} from "express"
import { getAllOrders,deleteOrderById,getOrderByUserId,addOrder,updateOrder_sent } from "../controller/order.js"
const router=Router();
router.get("/",getAllOrders);
router.get("/:id",getOrderByUserId);
router.delete("/:id",deleteOrderById);
router.post("/",addOrder);
router.put("/:id",updateOrder_sent);
export default router;
