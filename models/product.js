import { Schema, model ,Types} from "mongoose";

const productSchema = new Schema({
  name: String,
  description: String,
  img: String, 
  pickDate:{type:Date,default:new Date()},
  price: Number,
  shelfLife: Number,
  needSun: Boolean,
  existColors:{type:[String],min:1} ,
  isExist:{type:Boolean,default:true}
});

export const productModel = model("product", productSchema);


