const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'anunciar';
command.type = 'Moderação';
command.permissions = ['ADMINISTRATOR'];
command.description = 'anuncia mudanças';

command.execute = async function(client, message, args) {
	const channel = message.mentions.channels.first( ) || message.guild.channels.cache.get(args[0]);

	if(! channel ) return message.reply('o canal nao foi encontrado');

	const announcement = {
		title: null,
		content: null
	};

	await message.reply('Qual e o Titulo que você quer para esse Anuncio?');

	message.channel.createMessageCollector(msg => msg.author.id == message.author.id, { max: 1 })
	.on('collect', async content => {
		announcement.title = content.content;

		await message.reply('Qual e o conteudo do Anuncio?');

		message.channel.createMessageCollector(msg => msg.author.id == message.author.id, { max: 1 })
		.on('collect', async content => {
			announcement.content = content.content;

			try {
				const embed = new MessageEmbed( );

				embed.setTitle(announcement.title);
				embed.setDescription(`${announcement.content}`);

				channel.send( embed );
			} catch ( error ) {
				console.error ( error );
				message.reply('ocorreu um erro ao enviar a mensagem de anuncio');
			};
		});
	});
};
    

module.exports = command