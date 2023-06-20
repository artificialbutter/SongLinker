const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { Client, GatewayIntentBits, ActivityType, messageLink } = require("discord.js");
const Odesli = require('odesli.js');
const fetch = require('node-fetch');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const odesli = new Odesli();

client.on("ready", () => {
    client.user.setPresence({
        activities: [{ name: `for music links`, type: ActivityType.Watching }],
        status: 'online',
    });

    console.log(`Logged in as ${client.user.tag}!`);
})

client.on("messageCreate", async (message) => {
    const urls = message.content.match(/(https?:\/\/(music\.apple\.com|open\.spotify\.com|soundcloud\.com)\/[^\s]+)/g);

    if (urls) {
        message.channel.sendTyping();
        urls.forEach(async url => {
            try {
                let song = await odesli.fetch(url);

                message.reply(`${song.pageUrl}`, {
                    failIfNotExists: true
                })
            } catch (error) {
                console.error(error);
            }

        });
    }

    if (message.content.startsWith('music:')) {
        try {
        let MessageContent = message.content.replace('music:', '');
        let song = await odesli.fetch(MessageContent);   
            message.reply(`${song.pageUrl}`, {
                failIfNotExists: true
            })
        } catch (error) {
            console.error(error);
        }
    }

});

client.login(process.env.DISCORD_TOKEN);