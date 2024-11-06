const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const api = require('../handles/api');

// Main command module for the blackbox command
module.exports = {
  name: 'blackbox',
  description: 'Interact with the Blackbox API to receive responses based on a query.',
  usage: 'blackbox <query>',
  author: 'chilli',
  
  async execute(chilli, args, kalamansi) {
    if (!args || args.length === 0) {
      await sendMessage(chilli, {
        text: 'Please provide a query.\n\nExample: blackbox yokoso'
      }, kalamansi);
      return;
    }

    // Construct the Blackbox API URL with the query
    const query = args.join(' ');
    const apiUrl = `${api.kaizen}/api/blackbox?q=${encodeURIComponent(query)}&uid=911`;

    // Inform the user that the request is being processed
    await sendMessage(chilli, { text: 'Processing your request... Please wait.' }, kalamansi);

    try {
      // Make a request to the Blackbox API
      const response = await axios.get(apiUrl);
      const { response: apiResponse } = response.data;

      // Send the API response in chunks if it's too long
      await sendConcatenatedMessage(chilli, apiResponse, kalamansi);
      
    } catch (error) {
      console.error('Error with Blackbox API:', error);
      await sendMessage(chilli, {
        text: 'An error occurred while fetching the response. Please try again later.'
      }, kalamansi);
    }
  }
};

// Function to send concatenated messages with chunking, headers, and footers
async function sendConcatenatedMessage(chilli, text, kalamansi) {
  const maxMessageLength = 2000;
  const header = '⿻ | 𝗕𝗟𝗔𝗖𝗞𝗕𝗢𝗫 𝗔𝗜\n━━━━━━━━━━━━\n';
  const footer = '\n━━━━━━━━━━━━';
  const chunkSize = maxMessageLength - header.length - footer.length;

  // Check if the text needs to be split into chunks
  if (text.length > chunkSize) {
    const messages = splitMessageIntoChunks(text, chunkSize);

    // Send each chunk with the header and footer
    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Delay to avoid rate limits
      await sendMessage(chilli, { text: `${header}${message}${footer}` }, kalamansi);
    }
  } else {
    // Send the message as a single chunk if it's short enough
    await sendMessage(chilli, { text: `${header}${text}${footer}` }, kalamansi);
  }
}

// Helper function to split text into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
