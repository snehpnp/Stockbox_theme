const axios = require('axios');

const sendSMS = async (mobile, token) => {

 const authKey = '96b7e05297b4f4f4f416c9bc1c8f42b2'; // your real auth key
  const sender = 'RESLTD';
  const route = 'B';
  const coding = '1';
  const templateId = '1407174471217960479'; // your real template ID
  const message = `${token} is your OTP to login into the RM Pro App. Do not share this with anyone. Link - https://bit.ly/3G88mN0`;


  // encodeURIComponent ensures special characters are URL-safe
  const encodedMessage = encodeURIComponent(message);

  const url = `http://sms.bulksmsserviceproviders.com/api/send_http.php?authkey=${authKey}&sender=${sender}&mobiles=${mobile}&route=${route}&coding=${coding}&Template_ID=${templateId}&message=${encodedMessage}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('SMS Send Error:', error.response?.data || error.message);
    throw error;
  }


};

module.exports = { sendSMS };
