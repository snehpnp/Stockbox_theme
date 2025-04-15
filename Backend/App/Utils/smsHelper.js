const axios = require('axios');

const sendSMS = async (mobile, token) => {
  const url = 'http://sms.bulksmsserviceproviders.com/api/send/sms';

  const postData = {
    campaign_name: 'Research Mart Services Private Limited',
    auth_key: '96b7e05297b4f4f4f416c9bc1c8f42b2',
    receivers: mobile,
    sender: 'RESLTD',
    route: 'TR',
    message: {
      msgdata: `${token} is your OTP to login into the RM Pro App. Do not share this with anyone. Link https://bit.ly/3E1mzkY`,
      Template_ID: '1407174341512539982',
      coding: '1'
    },
    scheduleTime: ''
  };

  try {
    const response = await axios.post(url, postData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('SMS Send Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendSMS };
