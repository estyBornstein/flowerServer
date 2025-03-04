import { Schema, model } from "mongoose";

// יצירת סכימת משתמש
const userSchema = new Schema({
  email: {
    type: String,
    trim: true, // מסיר רווחים מיותרים
    match: [/.+@.+\..+/, "Please enter a valid email address"], // ולידציה למייל
  },
  userName: {
    type: String,
    minlength: 2, // מינימום 3 תווים
  },
  password: {
    type: String,
    minlength: 6, // מינימום 6 תווים
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"], // תפקידים אפשריים
    default: "USER", // ערך ברירת מחדל
  },
  registrationDate: {
    type: Date,
    default: new Date(), // תאריך יצירה אוטומטי
  },
});
// יצירת מודל וייצואו
export const userModel = model("user", userSchema);


