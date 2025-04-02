const admin = require('firebase-admin');
// const serviceAccount = require('../../template/stockbox-15e55-firebase-adminsdk-1zz93-5e353b0a02.json');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);

if (!admin.apps.length) {
  console.log('Initializing Firebase Admin SDK...');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized.');
}


async function sendFCMNotification(title, body, tokens, type = "") {
  try {

    const tokenss = [...new Set(tokens)];


    const uniqueValidTokens = tokenss
      .filter((token) => token && token.trim() !== '') // Remove empty tokens
      .filter((token, index, self) => self.indexOf(token) === index); // Remove duplicates

    const messages = uniqueValidTokens.map(token => ({
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: {
        additional_data: 'value',
        type: type,
      },
      android: {
        priority: "high", // High priority for real-time delivery
        ttl: 3600000, // Time-to-live: 1 hour in milliseconds
      },

    }));




    const response = await Promise.all(
      messages.map(message => admin.messaging().send(message))
    );

  } catch (error) {

  }
}


module.exports = { sendFCMNotification };
