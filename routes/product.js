import {Router} from "express"
import { addFlower,deleteFlowerById,getAllFlowers,getFlowerById,updateFlower} from "../controller/product.js"
const router=Router();
router.get("/",getAllFlowers);
router.get("/:id",getFlowerById);
router.delete("/:id",deleteFlowerById);//לא קיים מחיקת פרח בפועל זה רק עדכון של שדה
router.post("/",addFlower);
router.put("/:id",updateFlower);
export default router;