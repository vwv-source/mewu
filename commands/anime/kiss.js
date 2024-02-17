const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")
const ActionsClient = require('discord-actions')
const aClient = new ActionsClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Kiss someone!')
        .addUserOption(option => option.setName('user')
            .setDescription("Person to kiss.")
            .setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        await interaction.deferReply();

        var guild = client.guilds.cache.get(interaction.guildId);
        var member = guild.members.cache.get(user.id);
        var embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${interaction.member.displayName} kissed ${member.displayName}!`)
            .setImage((await aClient.sfw.kiss()).url)
            .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })
        await interaction.editReply({ embeds: [embed] });
    }
}