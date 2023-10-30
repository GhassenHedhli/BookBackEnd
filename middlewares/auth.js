import jwt from "jsonwebtoken";
import User  from "../models/user.js"; 
import { response } from "express";

 const loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET")
    const userId = decodedToken.userId
    User.findOne({_id:userId}).then((reponse)=>{
      if(reponse){
        req.auth = {
          userId: userId,
          role:response.role
        }
        next()
      }
      else{
        res.status(401).json({error:"user doesn't exist"});
      }
    }).catch((error)=>{res.status(500).json({error:error.message})})
    
  
  } catch (error) {
    res.status(401).json({ error })
  }
}

 export const isAdmin =(req, res, next)=>{
  try{
    if(req.auth.role === 'admin'){
      next();
    }else{
      res.status(401).json({error:"no access to this role"})
    }
  }
  catch(error){res.status(401).json({ error:error.message })}
}

export default loggedMiddleware