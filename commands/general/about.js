const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")
const path = require("path");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Info about the bot.'),

    async execute(interaction, client) {
        await interaction.deferReply();

        //Checks for the number of commands
        //Note: This is copied from a stackoverflow post
        let files = [];
        const getFilesRecursively = (directory) => {
            const filesInDirectory = fs.readdirSync(directory);
            for (const file of filesInDirectory) {
                const absolute = path.join(directory, file);
                if (fs.statSync(absolute).isDirectory()) {
                    getFilesRecursively(absolute);
                } else {
                    files.push(absolute);
                }
            }
        };
        getFilesRecursively("./commands");

        var embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`About ${config.botName}`)
            .setDescription(`${config.botName} is a general purpose bot made for fun by vewu.`)
            .setThumbnail(config.embedProfileImageUrl)
            .addFields(
				{ name: 'Source Code:', value: `[Click here.](https://github.com/vwv-source/mewu)`, inline:true },
                { name: 'Discord Server:', value: "`None.`", inline:true },
				{ name: 'Commands:', value: "`"+files.length+"`", inline:true },
			)
        await interaction.editReply({ embeds: [embed] });
    }
}