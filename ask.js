const { MessageEmbed } = require("discord.js");

const command = { };

command.name = 'pergunta';
command.aliases = ['ask'];
command.type = 'Diversão';
command.description = 'Faz uma pergunta ao bot';

command.execute = async function(client, message, args) {
	const question = args.join(' ');

	if(! question ) return message.reply('você precisa colocar a pergunta bobinho');
  
	const replies = ['Sim', 'Não', 'Talvez', 'Talvez mais tarde eu saiba', 'Pode ser que sim', 'Pode ser que não', 'Não faço ideia'];
	const response = replies[ Math.floor(Math.random( ) * replies.length) ];

	const embed = new MessageEmbed( );
	
	embed.setColor('#c3c3c3');
	embed.addField('Pergunta', question);
	embed.addField('Resposta', response);
	embed.setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL());

	message.channel.send( embed );
};
    

module.exports = command;