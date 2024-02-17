const malScraper = require('mal-scraper')
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('episodelist')
        .setDescription('Lists episodes from an anime.')
        .addStringOption(option => option.setName('name')
            .setDescription("Name of the anime.")
            .setRequired(true)),

//This code is ported from an old bot, So it might be a bit wack

    async execute(interaction, client) {
        var animename = interaction.options.getString('name');
        interaction.deferReply();
        var malsearch = malScraper.getEpisodesList(animename).then((malsearchresult) => {
            var animechars = malsearchresult
            var fields = [];
            for(var i = 0; i < animechars.length && i < 25; i++){
                fields.push({ name:(i+1)+". " + animechars[i].title, value:'Aired: '+animechars[i].aired+"\nDiscussion: "+`[Click here.](${animechars[i].discussionLink})`, inline:true})
            }

            const epEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                // .setTitle(malsearchresult.title)
                // .setThumbnail(malsearchresult.picture)
                .addFields(fields)
                .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName})
            interaction.editReply({ embeds: [epEmbed] })
            return;
        });
        return;
    }
}