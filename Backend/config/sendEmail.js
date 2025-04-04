// import { Resend } from "resend";
// import dotenv from "dotenv";
// dotenv.config();

// if (!process.env.RESEND_API) {
//   console.log("Please provide RESEND_API inside the .env file.");
// }

// const resend = new Resend(process.env.RESEND_API);

// const sendEmail = async ({ sendTo, subject, html }) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Quicko <onboarding@resend.dev>",
//       to: sendTo,
//       subject: subject,
//       html: html,
//     });
//     if (error) {
//       return console.error({ error });
//     }

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default sendEmail;


import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.BREVO_SMTP_KEY) {
  console.log("Please provide BREVO_SMTP_KEY inside the .env file.");
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "nitinbharti6394358223@gmail.com", 
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Quicko" <nitinbharti6394358223@gmail.com>`,
      to: sendTo,
      subject: subject,
      html: html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;