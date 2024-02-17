const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")
const ActionsClient = require('discord-actions')
const aClient = new ActionsClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption(option => option.setName('user')
            .setDescription("Person to hug.")
            .setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        await interaction.deferReply();

        var guild = client.guilds.cache.get(interaction.guildId);
        var member = guild.members.cache.get(user.id);
        var embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${interaction.member.displayName} hugged ${member.displayName}!`)
            .setImage((await aClient.sfw.hug()).url)
            .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })
        await interaction.editReply({ embeds: [embed] });
    }
}