const malScraper = require('mal-scraper')
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('charlist')
        .setDescription('Lists characters from an anime.')
        .addStringOption(option => option.setName('name')
            .setDescription("Name of the anime.")
            .setRequired(true)),

    async execute(interaction, client) {
        var animename = interaction.options.getString('name');
        interaction.deferReply();
        var malsearch = malScraper.getInfoFromName(animename).then((malsearchresult) => {
            var animechars = malsearchresult.characters
            var fields = [];
            for(var i = 0; i < animechars.length && i < 9; i++){
                fields.push({ name:(i+1)+". " + animechars[i].name, value:'Role: ' + animechars[i].role + "\nLink: " + `[Click here.](${animechars[i].link})` + "\nPicture: " + `[Click here.](${animechars[i].picture})`, inline:true})
            }

            const charsEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(malsearchresult.title)
                .setThumbnail(malsearchresult.picture)
                .addFields(fields)
                .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName})
            interaction.editReply({ embeds: [charsEmbed] })
            return;
        });
        return;
    }
}