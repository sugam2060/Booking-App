import { mailSender } from "./MailSender";

export const generateOTP = async (email:string) => {
    const digits = '0123456789';
    let otp = ''
    
    for(let i = 0; i < 6; i++){
        otp += digits[Math.floor(Math.random() * digits.length)]
    }
    

    const res = await mailSender(email,'OTP Verification',otp);
    
    if(res){
        return otp
    }
    else{
        return false
    }
}   