// emailService.js
const nodemailer = require('nodemailer');
const db = require("../Models");

/**
 * Creates and returns a transporter object using SMTP transport.
 * @returns {Promise<nodemailer.Transporter>} - The transporter object.
 */
async function createTransporter() {
  try {
   
    const transporter = nodemailer.createTransport({
      host: 'mail.tradestreet.in',
      port: 465,
      secure: 465, 
      auth: {
        user: 'connectbox@tradestreet.in',
        pass: 'Connect#box3211',
      },
    });
    return transporter;
  } catch (error) {
    console.log('Error creating transporter:', error);
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
    console.log('Message sent:', info.messageId);
    return info;
  } catch (error) {
    console.log('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
