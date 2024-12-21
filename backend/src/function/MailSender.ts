import nodemailer from 'nodemailer'

const pass = process.env.EMAIL_PASS 

export const mailSender = async (recepient: string, subject: string, text:string) => {
    try{
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{
                user:'sugampudasaini2060@gmail.com',
                pass:pass
            }
        })

        const mailInfo: nodemailer.SendMailOptions = {
            from: `BOOKING.COM <>sugampudasain2060@gmail.com`,
            to:recepient,
            subject:subject,
            html: `<p>${text}</p>`
        }

        const info = await transporter.sendMail(mailInfo);
        if(info.accepted.length === 1){
            return true
        }else{
            return false
        }
    }catch(err){
        console.log(err)
        return false
    }
}