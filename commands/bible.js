const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const api = require('../api'); // Import the API configuration

module.exports = {
  name: 'bible',
  description: 'Get a random Bible verse using the JoshWeb API.',
  usage: 'bible\nExample: bible',
  author: 'chilli',
  async execute(senderId, args, pageAccessToken) {
    const apiUrl = `${api.joshWebApi}/bible`; // Use the base URL from api.js

    try {
      const response = await axios.get(apiUrl);
      const { reference, verse } = response.data;

      await sendMessage(senderId, {
        text: `📖 *Bible Verse of the Day* 📖\n\n*${reference}*\n"${verse.trim()}"\n\n🙏 Have a blessed day! 🙏`
      }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while fetching the Bible verse. Please try again later.'
      }, pageAccessToken);
    }
  }
};
