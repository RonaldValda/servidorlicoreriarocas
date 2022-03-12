const nodemailer = require ('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: 'rhyno12091991@gmail.com',
        pass: 'frbvgsnbszmookce',
    }
});
transporter.verify().then(()=>{
    console.log("listo el envío de emails");
});
module.exports=transporter;