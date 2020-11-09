const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'roubar';
command.aliases = ['steal'];
command.type = 'Economia';
command.description = 'Roube um usuario';

command.execute = async function(client, message, args) {
	const Save = require('../jsons/index.js');
	const Users = require('../jsons/users.json');
	const User = Users[ message.author.id ];

	if(! User ) return messsage.reply('tente usar o comando novamente');

	const mention = message.mentions.members.first( );

	if(! mention ) return message.reply('você precisa marcar a quem quer roubar');
	if( mention.user.id == message.author.id ) return message.reply('você não pode se roubar');

	const MentionData = Users[ mention.user.id ];

	if(! MentionData ) return message.reply('este usuario nao possui dados, tente com outro');

	if( Math.random( ) < 0.5 ) {
		return message.reply('você nao conseguiu roubar');
	} else {
		const Cash = Math.floor(Math.random( ) * MentionData.profile.cash);
		
		MentionData.profile.cash -= Cash;
		User.profile.cash += Cash;

		await Save('users.json', Users);
		message.reply(`você roubou \`${Cash}\` **coins** de ${mention.user.username}`);
	};
};
    

module.exports = command;