const command = { };

command.name = 'destrancar';
command.aliases = ['unlock'];
command.type = 'Defesa';
command.permissions = ['MANAGE_CHANNELS'];
command.description = 'Desblockeia o canal';

command.execute = async function(client, message, args) {
	await message.channel.overwritePermissions([{ id: message.guild.id, allow: ['SEND_MESSAGES'] }]);
	message.reply('🔓o canal foi desbloqueado com sucesso🔓');
};
    

module.exports = command;