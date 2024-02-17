const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")
const randomCat = require('random-cat-img');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Sends a cat picture.'),

    async execute(interaction, client) {
        await interaction.deferReply();

        const res = await randomCat();
        var embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle("Here's a cute cat picture for you!")
            .setImage(res.data.message)
            .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })
        await interaction.editReply({embeds: [embed]});
        // switch(option){
        //     case "welcomemsg":
        //         var member = interaction.guild.members.cache.get("1117507080992071832");
        //         var avatar = member.user.displayAvatarURL({ size: 1024, dynamic: true });
        //         var embed = new EmbedBuilder()
        //             .setColor(config.embedColor)
        //             .setDescription("We hope you enjoy your stay here! <33")
        //             .setImage("https://cdn.discordapp.com/attachments/1113243314708295800/1142969717422837852/E7EJd4Qi.jpg")
        //             .setAuthor({iconURL:avatar, name:`Welcome to the server, ${"vewu"}!`})
        //             .setFooter({iconURL:config.embedProfileImageUrl, text:config.botName})
        //         await interaction.editReply({embeds: [embed]});
        //         break;
        //     default: 
        //         await interaction.editReply("Doesn't exist.");
        // }
    }
}