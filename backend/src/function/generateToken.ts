import jwt, { JwtPayload } from 'jsonwebtoken'

const secretKey = process.env.JWT_SECRET_KEY as string

export const generateToken = (otp: string) => {
    const token = jwt.sign({ otp }, secretKey, { expiresIn: '2m' })
    return token
}



export const verifyOTP = (otp: string, token: string) => {
    try {
        const tokenOTP = jwt.verify(token, secretKey) as {otp:string}
        if(tokenOTP.otp === otp){
            return true
        }
        else{
            return false
        }
    }
    catch (err) {
        console.log('Token Expired');
        return false
    }
}
