const nodemailer = require('nodemailer');

module.exports = async (email,subject, text ) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            post: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SERCURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text

        }).then(console.log('Email sent success')).catch(error => console.log(error))
    }catch(error){
        console.log("sent failure")
        console.log(error)
    }
}