import {Router} from "express"
import {addUser, getAllUsers, getUserById, login, updatePassword, updateUser, signUpWithGoogle, loginGoogle} from "../controller/user.js" // הוספתי את הפונקציות של גוגל
import { check } from "../middlewares/check.js";
const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", addUser);
router.post("/login", login);
router.put("/updatePassword", check, updatePassword);
router.put("/:id", updateUser);
router.post("/google", loginGoogle);
router.post("/signUpWithGoogle", signUpWithGoogle);


// הוספת נתיבים עבור התחברות עם גוגל
// router.get("/auth/google", googleLogin); // התחברות דרך גוגל
// router.get("/auth/google/callback", googleCallback); // החזרת המשתמש לאחר ההתחברות

export default router;
