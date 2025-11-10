const Guest = require('../models/Guest');
const sendEmail = require('../utils/email');

// @desc    Envoyer des emails groupés
// @route   POST /api/admin/emails
// @access  Admin
const sendBulkEmails = async (req, res) => {
  try {
    let guests;
    
    switch (req.body.recipients) {
      case 'confirmed':
        guests = await Guest.find({ isAttending: true });
        break;
      case 'notResponded':
        guests = await Guest.find({ responded: false });
        break;
      default:
        guests = await Guest.find();
    }
    
    const emails = guests.map(guest => guest.email);
    
    await sendEmail({
      to: emails.join(','),
      subject: req.body.subject,
      text: req.body.message,
      html: `<p>${req.body.message.replace(/\n/g, '<br>')}</p>`
    });
    
    res.json({ message: `Emails envoyés à ${emails.length} destinataires` });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: "Erreur lors de l'envoi des emails" });
  }
};

module.exports = { sendBulkEmails };