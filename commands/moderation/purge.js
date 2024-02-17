const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Removes a specified number of messages.')
        .addIntegerOption(option => option.setName('amount')
            .setDescription("Amount of messages to remove.")
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');
        await interaction.deferReply({ephemeral: true});
        var embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`Deleted ${amount} messages successfully!`)
            .setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })

        await interaction.channel.bulkDelete(amount);
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}