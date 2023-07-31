import nodemailer from "nodemailer";

const sendEmail = async ({
  from = process.env.EMAIL,
  to,
  cc,
  bcc,
  fromPrefix = "Mina Malak",
  subject,
  text,
  html,
  attachments,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail({
    from: `'${fromPrefix}' <${from}>`, // sender address
    to, // ['', ''] list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
    cc, // email or list of emails
    bcc,
    attachments,
    // attachments : [
    //     {
    //         filename:"sss.txt",
    //         content:"Hello world"
    //     },
    //     {
    //         filename:"newTxt.txt",
    //         path:"./newTxt.txt"
    //     },
    //     {
    //         filename:"newTxtd.pdf",
    //         path:"./newTxt.pdf",
    //         contentType: "application/pdf"
    //     }
    // ]
  });
};
export default sendEmail;