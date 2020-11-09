const { MessageEmbed } = require('discord.js');

const command = { };

command.name = 'acordei';
command.aliases = ['uptime'];
command.type = 'Informação';
command.description = 'Mostra a quanto tempo estou online.';

command.execute = async function(client, message, args) {
	const totalSeconds = client.upTime / 1000;
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor(totalSeconds % 60 / 60);
	const seconds = totalSeconds % 60 % 60;

	const uptime = `🗓️ ${days} Dias\n🗓️ ${hours} Horas\n🗓️ ${minutes} Minutos\n🗓️ ${seconds} Segundos`;

	const embed = new MessageEmbed( );

	embed.setTitle('Tempo de Atividade');
	embed.setColor('#c3c3c3');
	embed.setDescription(uptime);
	embed.setTimestamp( );
	embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());

	message.channel.send( embed );
};
    

module.exports = command;