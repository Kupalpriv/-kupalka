const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  author: 'chilli',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map((file) => {
      const command = require(path.join(commandsDir, file));
      if (command.name && command.description) {
        return {
          title: command.name,
          description: command.description,
          payload: `${command.name.toUpperCase()}_PAYLOAD`
        };
      }
      console.warn(`Command file "${file}" is missing a "name" or "description" property.`);
      return null;
    }).filter(cmd => cmd !== null);

    // Add auto download commands to the list
    commands.push({
      title: "Download TikTok Video",
      description: "Automatically downloads TikTok videos without watermark if you send a TikTok video link.",
      payload: "TIKTOK_DOWNLOAD_PAYLOAD"
    });
    commands.push({
      title: "Download Facebook Reels",
      description: "Automatically downloads Facebook Reels videos if you send a Reels link.",
      payload: "FBREELS_DOWNLOAD_PAYLOAD"
    });

    const totalCommands = commands.length;
    const commandsPerPage = 5;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);
    let page = parseInt(args[0], 10);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (args[0] && args[0].toLowerCase() === 'all') {
      const helpTextMessage = `📋 | CMD List:\n🏷 Total Commands: ${totalCommands}\n\n${commands.map((cmd, index) => `${index + 1}. ${cmd.title} - ${cmd.description}`).join('\n\n')}`;

      return sendMessage(senderId, {
        text: helpTextMessage,
        buttons: [
          {
            type: "web_url",
            url: "https://www.facebook.com/Churchill.Dev4100",
            title: "Contact Developer"
          }
        ]
      }, pageAccessToken);
    }

    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const commandsForPage = commands.slice(startIndex, endIndex);

    if (commandsForPage.length === 0) {
      return sendMessage(senderId, { text: `Invalid page number. There are only ${totalPages} pages.` }, pageAccessToken);
    }

    const helpTextMessage = `📋 | CMD List (Page ${page} of ${totalPages}):\n🏷 Total Commands: ${totalCommands}\n\n${commandsForPage.map((cmd, index) => `${startIndex + index + 1}. ${cmd.title} - ${cmd.description}`).join('\n\n')}\n\nType "help [page]" to see another page, or "help all" to show all commands.`;

    const quickRepliesPage = commandsForPage.map((cmd) => ({
      content_type: "text",
      title: cmd.title,
      payload: cmd.payload
    }));

    const buttons = [
      {
        type: "web_url",
        url: "https://www.facebook.com/Churchill.Dev4100",
        title: "Contact Developer"
      }
    ];

    sendMessage(senderId, {
      text: helpTextMessage,
      quick_replies: quickRepliesPage,
      buttons: buttons
    }, pageAccessToken);
  }
};
