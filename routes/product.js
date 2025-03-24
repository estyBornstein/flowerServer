import {Router} from "express"
import { addFlower,deleteFlowerById,getAllFlowers,getFlowerById,getTotalCount,updateFlower} from "../controller/product.js"
import { check } from "../middlewares/check.js";
import {uploadImage} from "../middlewares/image.js"

const router=Router();

router.get("/",getAllFlowers);
router.get("/getNumPage",getTotalCount)
router.get("/:id",getFlowerById);
router.delete("/:id",check,deleteFlowerById);//לא קיים מחיקת פרח בפועל זה רק עדכון של שדה
router.post("/",check,uploadImage,addFlower);
router.put("/:id",check,uploadImage,updateFlower);

export default router;