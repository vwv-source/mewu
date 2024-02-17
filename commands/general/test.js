const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json")
var fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Command used for testing (duh).')
        .addStringOption(option => option.setName('option')
            .setDescription("Thing to test.")
            .setRequired(true))
        .addStringOption(option => option.setName('option2')
            .setDescription("Option for thing to test.")
            .setRequired(false))
        .addStringOption(option => option.setName('option3')
            .setDescription("3rd option for the thing to test.")
            .setRequired(false)),

    async execute(interaction, client) {
        const option = interaction.options.getString('option');
        const option2 = interaction.options.getString('option2');
        const option3 = interaction.options.getString('option3');
        await interaction.deferReply();

        async function DBcreateUser(id){
            var userdata = {}
            fs.mkdirSync('./database/'+id, function (err) {
                if (err) return console.log(err);
            });
            fs.writeFileSync('./database/'+id+'/data.json', JSON.stringify(userdata), function (err) {
                if (err) return console.log(err);
            });
        }

        async function DBeditVariable(id, variablename, variable){
            var userdata = await fs.readFileSync('./database/'+id+'/data.json', 'utf8')
            userdata = JSON.parse(userdata)
            userdata[variablename] = variable;

            fs.writeFileSync('./database/'+id+'/data.json', JSON.stringify(userdata), function (err) {
                if (err) return console.log(err);
            });
        }

        async function DBreadVariable(id, variablename){
            var userdata = await fs.readFileSync('./database/'+id+'/data.json', 'utf8')
            userdata = JSON.parse(userdata)

            if(!userdata[variablename]){
                return "UNDEFINED";
            }else{
                return userdata[variablename];
            }
        }

        switch(option){
            case "welcomemsg":
                var member = interaction.guild.members.cache.get("772821730070626314");
                var avatar = member.user.displayAvatarURL({ size: 1024, dynamic: true });
                var embed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription("We hope you enjoy your stay here! <33")
                    .setImage("https://cdn.discordapp.com/attachments/1113243314708295800/1142969717422837852/E7EJd4Qi.jpg")
                    .setAuthor({iconURL:avatar, name:`Welcome to the server, ${"vewu"}!`})
                    .setFooter({iconURL:config.embedProfileImageUrl, text:config.botName})
                await interaction.editReply({embeds: [embed]});
                break;

            case "createuser":
                DBcreateUser(interaction.user.id);
                interaction.editReply("Done!");
                break;

            case "editvariable":
                DBeditVariable(interaction.user.id, option2, option3);
                interaction.editReply("Done!");
                break;
            
            case "readvariable":
                interaction.editReply(await DBreadVariable(interaction.user.id, option2));
                break;
            
            case "leaveall":
                client.guilds.cache.map(c=> c.leave());
                break;

            default: 
                await interaction.editReply("Doesn't exist.");
        }
    }
}