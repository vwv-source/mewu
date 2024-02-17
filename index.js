const fs = require('node:fs');
const path = require('node:path');
const config = require("./config.json")
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Channel, Partials.Message, Partials.Reaction]});

client.commands = new Collection();

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	client.user.setPresence({ activities: [{ name: 'with fire' }], status: 'dnd' });
	//client.user.setPresence({ status: 'dnd' });
	console.log(`[STATUS] Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on('messageReactionAdd', async (reaction, user, interaction) => {
	if(config.pinBoardChannelId){
		const channel = client.channels.cache.get(reaction.message.channelId);
		const message = await channel.messages.fetch(reaction.message.id);
		const pinschannel = client.channels.cache.get(config.pinBoardChannelId);
		if(reaction.emoji.name == "📌") {
			var embed = new EmbedBuilder()
				.setColor(config.embedColor)
				.addFields(
					{ name: 'User:', value: `<@${message.author.id}>`, inline:true },
					{ name: 'Channel:', value: `<#${reaction.message.channelId}>`, inline:true },
					{ name: 'Link:', value: `[Click here](${message.url})`, inline:true },
					{ name: 'Message:', value: `${message.content}`},
				)
				.setTitle(`Pinned Message`)
				.setThumbnail(message.author.displayAvatarURL())
				.setFooter({ iconURL: config.embedProfileImageUrl, text: `mewu | ${reaction.message.id}`})
	
			if(message.attachments.size > 0){
				embed.setImage(message.attachments.first().url)
			}
			pinschannel.send({embeds:[embed]})
		}
	}
})

// client.on('guildMemberAdd', guildMember => {
// 	var avatar = guildMember.user.displayAvatarURL({ size: 1024, dynamic: true });
// 	var embed = new EmbedBuilder()
// 		.setColor(config.embedColor)
// 		.setDescription("We hope you enjoy your stay here! <33")
// 		.setImage("https://cdn.discordapp.com/attachments/1113243314708295800/1142969717422837852/E7EJd4Qi.jpg")
// 		.setAuthor({ iconURL: avatar, name: `Welcome to the server, ${guildMember.displayName}!` })
// 		.setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })
// 	guildMember.guild.channels.cache.get('1132440695433597020').send({embeds:[embed]});
// })

// client.on('guildMemberRemove', guildMember => {
// 	var avatar = guildMember.user.displayAvatarURL({ size: 1024, dynamic: true });
// 	var embed = new EmbedBuilder()
// 		.setColor(config.embedColor)
// 		.setDescription("They didn't like the server 😭")
// 		.setImage("https://cdn.discordapp.com/attachments/1113243314708295800/1143223503177396264/U1uw6F1T.gif")
// 		.setAuthor({ iconURL: avatar, name: `${guildMember.displayName} left the server!` })
// 		.setFooter({ iconURL: config.embedProfileImageUrl, text: config.botName })
// 	guildMember.guild.channels.cache.get('1132440695433597020').send({embeds:[embed]});
// })

// Log in to Discord with your client's token
client.login(config.token);