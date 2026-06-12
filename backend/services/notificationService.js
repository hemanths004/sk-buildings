exports.sendSMS = async (phone, message) => {
    console.log(`SMS to ${phone}: ${message}`);
    // Future: Add Twilio / Fast2SMS / MSG91 integration
  };
  
  exports.sendWhatsApp = async (phone, message) => {
    console.log(`WhatsApp to ${phone}: ${message}`);
    // Future: Add Twilio WhatsApp API, Meta WhatsApp Cloud API
  };
  
  exports.sendEmail = async (email, subject, body) => {
    console.log(`Email to ${email}: ${subject}`);
    // Future: Add Nodemailer or AWS SES
  };