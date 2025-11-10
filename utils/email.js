const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendInvitationEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`
    });
    logger.info(`Email envoyé à ${to}`);
  } catch (err) {
    logger.error(`Erreur d'envoi email à ${to}: ${err.message}`);
    throw err;
  }
};