const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6479a40a580286",
      pass: "64e2c9496482c5"
    },
  });

  await transporter.sendMail({
    from: "test mail <test@mail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  });
};

module.exports = sendEmail;
