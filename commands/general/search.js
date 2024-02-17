//AIzaSyDa3E10o4ffqtVTXGB07QM3U5t8_1YMtP0
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")
const GoogleImages = require('google-images');
const Gclient = new GoogleImages('03f9c0e4206f14ca4', 'AIzaSyDa3E10o4ffqtVTXGB07QM3U5t8_1YMtP0');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for an image!')
        .setNSFW(true)
        .addStringOption(option => option.setName('search')
            .setDescription("Thing to search for.")
            .setRequired(true)),

    async execute(interaction, client) {
        const search = interaction.options.getString('search');
        await interaction.deferReply();

        Gclient.search(search).then(async images => {
            var embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(`Searched for ${"`"+search+"`"}!`)
                .setImage(images[0].url)
                .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })
            await interaction.editReply({ embeds: [embed] });
        })
    }
}