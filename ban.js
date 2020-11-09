const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'banir';
command.aliases = ['ban'];
command.type = 'Moderação';
command.permissions = ['BAN_MEMBERS'];

command.execute = async function(client, message, args) {
	const member = message.mentions.members.first( );
	if(! member ) return message.reply('você precisa mencionar um usuario');
	if( member.id == message.author.id ) return message.reply('você nao pode se banir');

	const reason = args.slice(1).join(' ') || 'Sem Motivo';

	const embed = new MessageEmbed( );

	embed.setColor('#c3c3c3');
	embed.setDescription(`Você realmente deseja banir esse membro?`);
	embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());

	const msg = await message.channel.send( embed );
	await msg.react('✅');

	const filters = {
		yes: (reaction, user) => reaction.emoji.name == '✅' && user.id == message.author.id
	};

	msg.createReactionCollector(filters['yes'], { max: 1 })
	.on('collect', async( ) => {
		await msg.delete();

		try {
			await member.ban({ reason });

			embed.setTitle('Usuario banido');
			embed.setDescription(`O usuario \`${member.user.username}\` foi banido`);

			message.channel.send( embed );
		} catch ( error ) {
			console.error ( error );
			message.reply('ocorreu um erro ao banir o usuario');
		};
	});
};

module.exports = command;