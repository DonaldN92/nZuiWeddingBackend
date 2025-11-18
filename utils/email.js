const logger = require('./logger');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;

exports.sendEmail = async (to, data,templateFile) => {
  try {
      var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

      // Method to compile template
      const templateContent = await fs.readFile(`./emailTemplate/${templateFile}.hbs`, 'utf-8');
      const template = handlebars.compile(templateContent);
      const html = template(data);

      var mailOptions = {
          from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.ALERT_EMAIL}>`,
          to,
          cc:"patricenkouakep@gmail.com",
          subject: subjectMail(templateFile),
          html,
          text:generateTextVersion(data),
          // Important headers for image delivery
          headers: {
            'X-Entity-Ref': generateEmailId(),
            'List-Unsubscribe': `<https://server.nzui.tech:451/api/admin/unsubscribe?email=${encodeURIComponent(to)}>`,
            'X-Google-Images': 'allow' // Hint to Google
          }
      }
      const result =await  transporter.sendMail(mailOptions, function(error, info) {
          if (error) logger.error("emailTemplate--",error)
      })
      logger.info(`Email ${to} result ${result}`);

  } catch (err) {
    logger.error(`Erreur d'envoi email à ${to}: ${err.message}`);
    throw err;
  }
};

 
function subjectMail(template){
	if(template=="newUser") return "Bienvenue sur la plateforme nZui Party";
	else if(template=="newUser_en") return "Welcome to nZui Party";
	else if(template=="resetPassword") return "Réinitialisation de votre mot de passe";
	else if(template=="resetPassword_en") return "Reset your password";
	else if(template=="newMessage") return "Nouveau message";
	else if(template=="newMessage_en") return "New message";
	else if(template=="newRSVP") return "Nouvelle confirmation";
	else if(template=="newRSVP_en") return "New confirmation";
	else return "Nouvelle action publiée";
}

function generateTextVersion(data) {
  return `${JSON.stringify(data)}`.trim();
}
function generateEmailId() {
  return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}