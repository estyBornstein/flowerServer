import Jwt from "jsonwebtoken";


export function check(req,res,next){
    let token=req.headers.token;
    if(!token)
      return res.status(401).json({title:" user unauthorized",message:"First, log in"})
    try{
      let result=Jwt.verify(token,process.env.SECRET_KEY);
      req.user=result;//לבדוק
      next();
    }
    catch(err){
      return res.status(401).json({title:"user unauthorized",message:err.message})
    }


  }
