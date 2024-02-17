const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magical ball questions.')
        .addStringOption(option => option.setName('question')
            .setDescription("A yes or no question.")
            .setRequired(true)),

    async execute(interaction, client) {
        const question = interaction.options.getString('question');
        await interaction.deferReply();

        var ballResponses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
        var theAnswer = ballResponses[Math.floor(Math.random() * ballResponses.length)]

        var embed = new EmbedBuilder()
            .setColor(config.embedColor)
            //.setTitle(`${interaction.member.displayName} asked:`)
            .addFields(
                {name:question, value: theAnswer}
            )
            .setFooter({ iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`, text: "asked by "+interaction.member.displayName })
        await interaction.editReply({ embeds: [embed] });
    }
}