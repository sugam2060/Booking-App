import { Router, Request, Response } from "express";
import { User } from "../Database/models/user";
import jwt from 'jsonwebtoken'
import { check, validationResult } from "express-validator";
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
                const user = new User(req.body)
                await user.save()
                const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET_KEY as string,
                    { expiresIn: '1d' }
                )
                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.ENVIRONMENT === 'PRODUCTION',
                    maxAge: 86400000,
                })
                res.status(200).send({message:"user registration successfull"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "something went wrong" })
        }
    }

})



export default userRoute