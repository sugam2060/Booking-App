import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'


declare global{
    namespace Express {
        interface Request {
            userId: string
        }
    }
}



 const validate = async (req:Request,res:Response,next:NextFunction) => {
    const token = req.cookies['authToken']
    if(!token){
        res.status(401).json({message:"unauthorized"})
    }
    else{   
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string);
            req.userId = (decoded as JwtPayload).userId;
            next()
        }catch(err){
            res.status(401).json({message:"unauthorized"})
        }
    }

}

export default validate