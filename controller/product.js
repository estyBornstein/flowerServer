import mongoose from "mongoose"
import { productModel } from "../models/product.js"

export async function getAllFlowers(req, res) {
    try {
        let result = await productModel.find()
        if (result.lenght == 0)
            res.json("no flowers")
        else
            res.json(result)
    }
    catch (err) {
        res.status(400).json({title:"Failed to bring all the flowers",message:err.message})
     }
};
export async function getFlowerById(req, res) { 
    console.log(req.params)

    let {id}=req.params;
    try{
         let result=await productModel.findById( id)
       
        if(!result)
        return res.status(404).json({title:"Problem with the id",message:"There is no flower with such a code."})
    res.json(result)
    }
    catch (err) {
        res.status(400).json({title:"Failed to bring  the flower by id",message:err.message})
     }
};
export async function addFlower(req, res) { 
    let {body}=req;
if(!body.name||!body.price||!body.shelfLife||!body.needSun||!body.existColors)
return res.status(404).json({title:"missing data in body",message:"name, price, shelfLife,needSun and existColors are required"})
try{
    let newFlower=new productModel(req.body)
    await newFlower.save()
    res.json({
        message: "The flower added successfully",
        newFlower: newFlower,
      });
}
catch (err) {
    res.status(400).json({title:"Failed to add the flower",message:err.message})
 }
};
export async function deleteFlowerById(req, res) { 
    let {id}=req.params
    try{
        let result=await productModel.findByIdAndUpdate(id,{isExist:false},{new:true})
        if(!result)
        return res.status(404).json({title:"cannot delete by id",message:"no flower with such id"})
    res.json(result)
    }
    catch (err) {
        res.status(400).json({title:"Failed to delete the flower",message:err.message})
     }

};
export async function updateFlower(req, res) { 
    let {id}=req.params
    let {body}=req;
    try{
        let result=await productModel.findByIdAndUpdate(id,body,{new:true})
        if(!result)
        return res.status(404).json({title:"cannot update this flower",message:"no flower with such id"})
    res.json(result)
    }
    catch (err) {
        res.status(400).json({title:"Failed to update the flower",message:err.message})
     }
 
}


