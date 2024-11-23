const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const api = require('../handles/api');

module.exports = {
  name: 'sms',
  description: 'Send an SMS using the LBC SMS API.',
  usage: 'sms <number> <message>\nExample: sms 09123456789 Hello, this is a test!',
  author: 'chilli',
  async execute(senderId, args, pageAccessToken) {
    if (args.length < 2) {
      await sendMessage(senderId, {
        text: `❗ Please provide a valid phone number and message.\n\nExample: sms 09123456789 Hello palku`
      }, pageAccessToken);
      return;
    }

    const number = args[0].trim();
    const message = args.slice(1).join(' ').trim();

    // Validate PH mobile number format
    const phNumberRegex = /^09\d{9}$/;
    if (!phNumberRegex.test(number)) {
      await sendMessage(senderId, {
        text: '❗ Invalid phone number format. Please provide a valid PH number starting with 09.\n\nExample: 09123456789'
      }, pageAccessToken);
      return;
    }

    const apiUrl = `${api.kenlie}/freesmslbc/?number=${number}&message=${encodeURIComponent(message)}`;

    try {
      await sendMessage(senderId, {
        text: `📤 Sending SMS to ${number}... Please wait.`
      }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const { status, response: apiResponse, sim_network, message_parts, message_remaining } = response.data;

      if (status) {
        const successMessage = `✅ **SMS Sent Successfully!**

📍 **Recipient**: ${number}  
📤 **Message**: ${message}  
📡 **Network**: ${sim_network}  
📝 **Message Parts**: ${message_parts}  
📊 **Messages Remaining**: ${message_remaining.toFixed(2)}

📌 **You can test this command using your own number to verify if it works.  
Your phone number is safe and secure—it’s only used for the API request to send the SMS.**`;
        await sendMessage(senderId, { text: successMessage }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `⚠️ Failed to send SMS. Please try again later.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error in SMS command:', error.message || error);
      await sendMessage(senderId, {
        text: '⚠️ An error occurred while sending the SMS. Please try again later.'
      }, pageAccessToken);
    }
  }
};
