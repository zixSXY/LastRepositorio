const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'avatar';
command.type = 'Diversão';
command.description = 'Pega um avatar';

command.execute = async function(client, message, args) {
	const user =
		message.mentions.users.first( ) ||
		client.users.cache.get( args[0] ) ||
		client.users.cache.find(u => u.name == args.join(' ')) ||
		message.author;

	const embed = new MessageEmbed( );
	
	embed.setTitle(`Avatar de ${user.username}`);
	embed.setImage(user.displayAvatarURL({ dynamic: true }));
	embed.setColor('#c3c3c3');
	embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());

	message.channel.send( embed );
};
    

module.exports = command;