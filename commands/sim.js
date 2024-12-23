const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "sim",
  description: "SimSimi reply on command",
  usage: "sim <message>\nExample: sim Hello, how are you?",
  author: "chilli",
  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: "Please provide a message.\n\nExample: sim kupal kaba?"
      }, pageAccessToken);
      return;
    }

    const content = encodeURIComponent(args.join(" "));
    const simApiUrl = `https://hiroshi-api.onrender.com/other/sim?ask=${content}`;

    try {
      const res = await axios.get(simApiUrl);
      const respond = res.data.answer;

      if (res.data.error) {
        await sendMessage(senderId, {
          text: `⚠️ Error: ${res.data.error}`
        }, pageAccessToken);
        return;
      }

      if (typeof respond === "string") {
        await sendMessage(senderId, {
          text: respond
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: "⚠️ Received an unexpected response from the API."
        }, pageAccessToken);
      }
    } catch (error) {
      console.error("Error in Sim command:", error.message || error);
      await sendMessage(senderId, {
        text: "⚠️ An error occurred while processing your request. Please try again later."
      }, pageAccessToken);
    }
  }
};
