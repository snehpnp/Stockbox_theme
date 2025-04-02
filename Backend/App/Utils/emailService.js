// emailService.js
const nodemailer = require('nodemailer');
const db = require("../Models");
const BasicSetting_Modal = db.BasicSetting;

/**
 * Creates and returns a transporter object using SMTP transport.
 * @returns {Promise<nodemailer.Transporter>} - The transporter object.
 */
async function createTransporter() {
  try {
    const settings = await BasicSetting_Modal.findOne();
    if (!settings || !settings.smtp_status) {
      throw new Error('SMTP settings are not configured or are disabled');
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.smtp_port === 465, // Use SSL if port is 465
      auth: {
        user: settings.smtp_username,
        pass: settings.smtp_password,
      },
    });
    return transporter;
  } catch (error) {
    // console.log('Error creating transporter:', error);
    throw error;
  }
}

/**
 * Sends an email.
 * @param {Object} mailOptions - The mail options object.
 * @returns {Promise} - A promise that resolves when the email is sent.
 */
async function sendEmail(mailOptions) {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    // console.log('Message sent:', info.messageId);
    return info;
  } catch (error) {
    // console.log('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
