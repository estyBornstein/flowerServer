import {Router} from "express"
import {addUser,getAllUsers,getUserById,login,updatePassword,updateUser} from "../controller/user.js"
const router=Router();
router.get("/",getAllUsers);
router.get("/:id",getUserById);
router.post("/",addUser);
router.post("/login",login);
router.put("/updatePassword/:id",updatePassword);
router.put("/:id",updateUser);
export default router;