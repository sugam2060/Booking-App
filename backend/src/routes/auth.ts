import { Router,Request,Response } from "express";
import { check, validationResult } from "express-validator";
import { User } from "../Database/models/user";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userAuth = Router();


userAuth.post("/login",[
    check("email","Email is required").isEmail(),
    check("password","Password with 6 or more character is required").isLength({min:6})
],async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({message:errors.array()})
    }
    else{
        const {email,password} = req.body
        try {
            const user = await User.findOne({email})
            if(!user){
                res.status(400).json({message:"Invalid Credentials"})
            }else{
                const isMatch = await bcrypt.compare(password,user.password)
                if(!isMatch){
                    res.status(400).json({message:"Invalid Credentials"})
                }else{
                    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY as string,{expiresIn: '1d'})
                    res.cookie("authToken",token,{
                        httpOnly:true,
                        secure: process.env.ENVIRONMENT === 'PRODUCTION',
                        maxAge: 86400000
                    })
                    res.status(200).json({message:user._id})
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"something went wrong"})
        }
    }
})


export default userAuth