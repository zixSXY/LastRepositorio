const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'perfil';
command.aliases = ['profile'];
command.type = 'Economia';
command.description = 'Veja seu perfil';

command.execute = async function(client, message, args) {
	const Users = require('../jsons/users.json');
	const Save = require('../jsons/index.js');
	const User = Users[ message.author.id ];

	if(! User ) return message.reply('tente usar o comando novamente');

	const Embed = new MessageEmbed( );
	
	Embed.setTitle(`Perfil`);
	Embed.setDescription(`**Coins**: ${User.profile.cash}\n**Vip**: ${User.profile.vip ? message.guild.roles.cache.get(User.profile.vip) || 'Não encontrado' : `Nenhum`}`);
	Embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
	Embed.setColor('#c3c3c3');
	Embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());

	message.channel.send( Embed );
};


module.exports = command;