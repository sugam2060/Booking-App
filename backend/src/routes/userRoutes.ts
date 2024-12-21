import { Router, Request, Response } from "express";
import { User } from "../Database/models/user";
import jwt from 'jsonwebtoken'
import { check, validationResult } from "express-validator";
import { generateOTP } from "../function/generateOTPAndToken";
import { generateToken, verifyOTP } from "../function/generateToken";

const userRoute = Router();


userRoute.post('/register', [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more character is required").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array() })
    }
    else {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            if (user) {
                res.status(400).json({ message: "user already exists" })
            } else {
                const otp = await generateOTP(req.body.email as string)
                if(!otp){
                    res.status(400).json({message:'Something went wrong'})
                }else{
                    const token = generateToken(otp)
                    res.cookie('otpToken',token,{
                        httpOnly:true,
                        secure: process.env.ENVIRONMENT === 'PRODUCTION',
                        maxAge:120000
                    })
                    res.status(200).json({message:'otp sent'});
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "something went wrong" })
        }
    }

})


userRoute.post('/verify-otp',async(req:Request,res:Response)=>{
    const cookie = req.cookies['otpToken']
    
    const {otp,firstName,lastName,email,password} = req.body
     const response = verifyOTP(otp,cookie);
    
    if(response){
        try{
           const user = new User({email,firstName,lastName,password})
            await user.save();
            res.cookie('authToken',jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY as string,{expiresIn:'1d'}),{
                httpOnly:true,
                secure: process.env.ENVIRONMENT === 'PRODUCTION',
                maxAge: 86400000
            })
            res.clearCookie('otpToken');
            res.status(200).json({message:"Registered successfully"})
        }catch(err){
            console.log(err)
            res.status(400).json({message:"something went wrong"})
        }

    }else{
        res.status(400).json({message:"invalid otp"})
    }
})



export default userRoute