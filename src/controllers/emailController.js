import nodemailer from 'nodemailer';

export const sendEmail = async (emailTo, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADMIN_USER,
      pass: process.env.GMAIL_ADMIN_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ADMIN_USER,
    to: emailTo,
    subject: subject,
    html: html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error.message);
    }
  });
};
