const malScraper = require('mal-scraper')
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asearch')
        .setDescription('Search for an anime.')
        .addStringOption(option => option.setName('name')
            .setDescription("Name of the anime.")
            .setRequired(true)),

//This code is from 2 years ago, So the variable names are kinda weird
//And I'm too lazy to fix it lol

    async execute(interaction, client) {
        var asearch1 = interaction.options.getString('name');
        await interaction.deferReply();
        var asearchmsg1 = malScraper.getInfoFromName(asearch1).then((asearchmsg) => {
            var synonyms = asearchmsg.synonyms
            const synopsis1 = asearchmsg.synopsis
            var synopsis = synopsis1.substring(0, 500)
            if (synopsis1.length > 500) {
                synopsis = synopsis + '...'
            }
            if (!synonyms || synonyms == '') {
                synonyms = 'None.'
            }
            const asearch = new EmbedBuilder()
			    .setColor(config.embedColor)
                .setTitle(asearchmsg.title)
                .setThumbnail(asearchmsg.picture)
                .addFields(
                    { name: 'Synopsis:', value: synopsis},
                    { name: 'Score:', value: asearchmsg.score, inline:true },
                    { name: 'People scored:', value: asearchmsg.scoreStats, inline:true },
                    { name: 'Rank:', value: asearchmsg.ranked, inline:true },
                    { name: 'Popularity:', value: asearchmsg.popularity, inline:true },
                    { name: 'Favourites:', value: asearchmsg.favorites, inline:true },
                    { name: 'Link:', value: `[Click here.](${asearchmsg.url})`, inline:true },
                    { name: 'Trailer:', value: `[Click here.](${asearchmsg.trailer})`, inline:true },
                    { name: 'Episodes:', value: asearchmsg.episodes, inline:true },
                    { name: 'Age rating:', value: asearchmsg.rating, inline:true },
                    { name: 'Duration:', value: asearchmsg.duration, inline:true },
                    //{ name: 'Studios:', value: asearchmsg.studios, inline:true },
                    //{ name: 'Producers:', value: asearchmsg.producers, inline:true },
                    { name: 'Airing period:', value: asearchmsg.aired, inline:true },
                    { name: 'Source:', value: asearchmsg.source, inline:true },
                    { name: 'Japanese title:', value: asearchmsg.japaneseTitle, inline:true },
                    { name: 'Status:', value: asearchmsg.status, inline:true },
                    //{ name: 'Synonyms:', value: synonyms, inline:true },
                )
                .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName})
                //.addField('Genres:', asearchmsg.genres, true)
            interaction.editReply({embeds:[asearch]})
            return;
        });
    }
}
