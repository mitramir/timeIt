const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER_HOST,
      port: process.env.MAIL_SERVER_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_SERVER_USER,
        pass: process.env.MAIL_SERVER_PASSWORD,
      },
      authMethod: "PLAIN",
    });

    await transporter.sendMail({
      from: process.env.MAIL_SERVER_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
