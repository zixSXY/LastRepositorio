const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'afk';
command.type = 'Informação';
command.description = 'Fica inativo';

command.execute = async function(client, message, args) {
	const Users = require('../jsons/users.json');
	const Save = require('../jsons/index.js');

	const User = Users[ message.author.id ];

	if(! User ) return message.reply('tente usar o comando novamente');

	User.profile.afk = args.join(' ') || 'afk';

	await Save('users.json', Users);

	const embed = new MessageEmbed( );
	
	embed.setTitle(`Afk`);
	embed.setDescription('Afk setado');
	embed.addField('Mensagem', User.profile.afk);
	embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
	embed.setColor('#c3c3c3');
	embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());

	message.channel.send( embed );
};
    

module.exports = command;