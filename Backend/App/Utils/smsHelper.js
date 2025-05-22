const axios = require('axios');
const db = require("../Models");

const Smsprovider_Modal = db.Smsprovider;


const sendSMS = async (mobile, message, templateId) => {

  const activeProvider = await Smsprovider_Modal.findOne({ status: 1 });

  const authKey = activeProvider.apikey; 
  const sender = activeProvider.sender;
  const route = activeProvider.route;
  const urls = activeProvider.url;
  const username = activeProvider.username; 
  const password = activeProvider.password;
  const entity_id = activeProvider.entity_id;
  const name = activeProvider.name; 


  const coding = '1';
let config;
const encodedMessage = encodeURIComponent(message);

if(name=="bulksmsservice")
{
  config = `authkey=${authKey}&sender=${sender}&mobiles=${mobile}&route=${route}&coding=${coding}&Template_ID=${templateId}&message=${encodedMessage}`;
}
else if(name=="pushsms")
{
  config = `user=${username}&key=${authKey}&sender=${sender}&mobile=${mobile}&text=${encodedMessage}&entityid=${entity_id}&templateid=${templateId}`;
}
else if(name=="smartping")
{
  config = `username=${username}&password=${password}&unicode=false&from=${sender}&to=${mobile}&text=${encodedMessage}&dltPrincipalEntityId=${entity_id}&dltContentId=${templateId}`;
}

  const url = `${urls}?${config}`;
  console.log('SMS URL:', url);
  try {
    const response = await axios.get(url);
  console.log('SMS Response:', response.data);
    return response.data;
  } catch (error) {
   console.log('SMS Send Error:', error.response?.data || error.message);
    return error.message;
  }


};

module.exports = { sendSMS };
