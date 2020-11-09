const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'banco';
command.aliases = ['bank'];
command.type = 'economia';
command.description = 'coloca seu dinheiro no banco';

command.execute = async function(client, message, args) {
	const Users = require('../jsons/users.json');
	const Save = require('../jsons/index.js');

	const User = Users[ message.author.id ];

	if(! User ) return message.reply('tente usar o comando novamente');

	let ammount = Number(args[1] || 0);
	const author = { name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) };

	if(! args[0] ) {
		const embed = new MessageEmbed({ title: 'Banco', author, color: '#c3c3c3', description: `Saldo no banco: ${User.profile.bank}\nSaldo total: ${User.profile.cash}` })
		message.channel.send(embed);
	};
	if( args[0] == 'adicionar' ) {
		if( User.profile.cash < ammount ) return message.reply(`você nao possui ${ammount} coins para colocar no banco`);

		User.profile.bank += ammount;
		User.profile.cash -= ammount;

		await Save('users.json', Users);
		const description =
			`Saldo adicionado: ${ammount}\n` + 
			`Saldo novo: ${User.profile.bank}\n` +
			`Saldo antigo: ${User.profile.bank - ammount}`;


		const embed = new MessageEmbed({
			title: 'Banco',
			description,
			author,
			color: '#c3c3c3'
		});
		return message.channel.send(embed);
	} else if ( args[0] == 'remover' ) {
		if( User.profile.bank < ammount ) return message.reply(`você nao possui ${ammount} coins no banco`);

		User.profile.bank -= ammount;
		User.profile.cash += ammount;

		await Save('users.json', Users);
		const description =
			`Saldo removido: ${ammount}\n` + 
			`Saldo novo: ${User.profile.bank}\n` +
			`Saldo antigo: ${User.profile.bank + ammount}`;


		const embed = new MessageEmbed({
			title: 'Banco',
			description,
			author,
			color: '#c3c3c3'
		});
		return message.channel.send(embed);
	};
};

module.exports = command;