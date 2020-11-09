const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'trabalho';
command.aliases = ['work'];
command.type = 'Economia';
command.description = 'Trabalha para ganhar dinheiro';

command.execute = async function(client, message, args) {
	const Save = require('../jsons/index.js');
	const Users = require('../jsons/users.json');
	const Works = require('../jsons/works.json');
	const User = Users[ message.author.id ];

	if(! User ) return message.reply('tente usar o comando novamente');

	const last = User.profile.lastWork;
	const name = User.profile.works[ User.profile.work ];
	const work = Works[ name ];

	const minute = (1000 * 60 * 60);

	if(! args[0] ) {
		const embed = new MessageEmbed( );

		embed.setTitle('Trabalho');
		embed.setColor('#c3c3c3');
		embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());
		embed.addField('Trabalho atual', `**${name}**`);
		embed.addField('Ganho do Trabalho Atual', `**\`${work.reward}\`**`);
		embed.addField('Tempo do Trabalho Atual', `**\`${work.time / minute}\` minutos**`);
		embed.addField('Sub-Comandos', '**trabalhar** / **proximo** / **anterior** / **comprar**');

		return message.channel.send( embed );
	};

	if( args[0] == 'trabalhar' ) {
		if(Math.floor(Date.now( ) - last) / (minute) < 1 ) {
			const embed = new MessageEmbed( );

			embed.setTitle('Trabalhar');
			embed.setColor('#c3c3c3');
			embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());
			embed.setDescription(
				`Você não pode trabalhar ainda.\n` +
				`Voce podera trabalhar as ${new Date((last / minute) + (work.time / minute)).toLocaleTimeString( )}`
			);

			return message.channel.send( embed );	
		};

		User.profile.cash += work.reward;
		User.profile.lastWork = Date.now( );

		await Save('users.json', Users);

		const embed = new MessageEmbed( );

		embed.setTitle('Trabalhar');
		embed.setColor('#c3c3c3');
		embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());
		embed.setDescription(
			`Você trabalhou como **${name}** e recebeu **\`${work.reward}\` coins**\n` +
			`Você podera trabalhar novamente daqui **\`${work.time / (minute)}\`**`
		);

		return message.channel.send( embed );
	} else if ( args[0] == 'proximo' ) {
		if(! work.next ) return message.reply('você esta no **ultimo** trabalho');

		const embed = new MessageEmbed( );

		embed.setTitle('trabalho');
		embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());
		embed.setDescription(
			`Você esta no trabalho **${name}** o proximo sera **${work.next}**\n` +
			`Falta \`${Works[work.next].buy - User.profile.cash}\` **coins** para o seu proximo trabalho`
		);
		embed.setColor('#c3c3c3');

		return message.channel.send( embed );
	} else if ( args[0] == 'anterior' ) {
		if(! work.back ) return message.reply('você esta no **primeiro** trabalho');

		const embed = new MessageEmbed( );

		embed.setTitle('trabalho');
		embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());
		embed.setDescription(
			`Você esta no trabalho **${name}** o anterior e **${work.back}**`
		);
		embed.setColor('#c3c3c3');

		return message.channel.send( embed );
	} else if ( args[0] == 'comprar' ) {
		if(! work.next ) return message.reply('você esta no **ultimo** trabalho');

		if( Works[work.next].buy > User.profile.cash ) {
			return message.reply(`você precisa de mais \`${Works[work.next].buy - User.profile.cash}\` **coins** para comprar esse trabalho`)
		};

		User.profile.cash -= Works[work.next].buy;
		User.profile.works.push(work.next);
		User.profile.work += 1;
		User.profile.lastWork = 0;

		await Save('users.json', Users);
		
		const embed = new MessageEmbed( );

		embed.setTitle('trabalho');
		embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());
		embed.setDescription(
			`Você acabou de comprar um novo trabalho!\n` +
			`O tempo do trabalho foi resetado`
		);
		embed.setColor('#c3c3c3');

		return message.channel.send( embed );
	};
};
    

module.exports = command;