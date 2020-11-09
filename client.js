const discord = require('discord.js');
const client = new discord.Client( );
const fs = require('fs');

const { token } = require('./config.json');

const Users = require('./jsons/users.json');
const Guilds = require('./jsons/guilds.json');
const Save = require('./jsons/index.js');

const { MessageEmbed } = discord;

client.commands = new discord.Collection( );

fs.readdir(__dirname + '/commands/', function(err, commands) {
	if( err ) return console.erro ( err );
	
	commands.forEach(command => {
		if(! command.endsWith('.js') ) return;

		try {
			const cmd = require(__dirname + '/commands/' + command);

			client.commands.set(cmd.name, cmd);
			delete require.cache[ require.resolve(__dirname + '/commands/' + command) ];
		} catch ( err ) {
			console.error ( err );
		};
	});
});

function CreateUser( userId ) {
	const userObject = {
		inventory: {
			wallpapers: [{ name: 'Padão', path: __dirname + '/assets/wallpapers/default.png' }],
			borders: [{ name: 'Padão', path: __dirname + '/assets/wallpapers/default.png' }]
		},
		profile: {
			cash: 100,
			bank: 0,
			daily: 0,
			vip: false,
			viptime: 0,
			lastWork: 0,
			registers: 0,
			registred: false,
			works: ['lixeiro'],
			work: 0,
			afk: false
		}
	};

	Users[ userId ] = userObject;
	return userObject;
};

function CreateGuild( guildId ) {
	const guildObject = {
		prefix: '!',
		autorole: { status: false, roles: [ ] },
		joinMember: { status: false, channel: null, message: 'Olá <<user>>' },
		leaveMember: { status: false, channel: null, message: 'Adeus <<user>>' }
	};

	Guilds[ guildId ] = guildObject;

	return guildObject;
};

client.on('ready', ( ) => {
	console.log(`${client.user.username} online`);
});

client.on('ready', ( ) => {
const status = [
    {name: 'Meu nome é Last', type: 'PLAYING'},
    {name: 'Sou um bot Open Source', type: 'WATCHING'},
	{name: 'Fui criado no vs code pelo', type: 'LISTENING'}
  ]
  function Presence() {
    const base = status[Math.floor(Math.random() * status.length)]
    client.user.setActivity(base)
  }
  Presence();
  setInterval(() => Presence(), 5000)
});


client.on('guildMemberAdd', async function( member ) {
	let Guild = Guilds[ member.guild.id ];

	if(! Guild ) {
		Guild = CreateGuild( member.guild.id );
		await Save('guilds.json', Guilds);
	};
	const JoinMember = Guild.joinMember;

	if(! JoinMember.status || ! JoinMember.channel || ! JoinMember.message ) return;

	const Channel = member.guild.channels.cache.get( JoinMember.channel );

	if(! Channel ) return;

	try {
		const IsEmbed = JoinMember.message.match(/<<embed>>/);
		const EmbedColor = JoinMember.message.match(/<<embed\.color:(.{3,6})>>/);
		const EmbedTitle = JoinMember.message.match(/<<embed\.title:(.{1,})>>/);
		const EmbedThumb = JoinMember.message.match(/<<embed\.thumb:(.{1,})>>/);

		const Message = JoinMember.message
			.replace(/<<user>>/g, member)
			.replace(/<<user\.username>>/g, member.user.username)
			.replace(/<<user\.id>>/g, member.user.id)
			.replace(/<<user\.bot>>/g, member.user.bot ? 'bot' : 'humano')
			.replace(/<<user\.avatar>>/g, member.user.displayAvatarURL({ dynamic: true }))
			// guild //
			.replace(/<<guild>>/g, member.guild)
			.replace(/<<guild\.id>>/g, member.guild.id)
			// guild counters //
			.replace(/<<guild\.count>>/g, member.guild.members.cache.size)
			.replace(/<<guild\.count\.bot>>/g, member.guild.members.cache.filter(u => u.user.bot).size)
			.replace(/<<guild\.count\.users>>/g, member.guild.members.cache.filter(u => !u.user.bot).size)
			// guild owner //
			.replace(/<<guild\.owner>>/g, member.guild.owner)
			.replace(/<<guild\.owner\.id>>/g, member.guild.owner.id)
			.replace(/<<guild\.owner\.username>>/g, member.guild.owner.username)
			// embed //
			.replace(/<<embed>>/g, '')
			.replace(/<<embed\.color:(.{3,6})>>/g, '')
			.replace(/<<embed\.title:(.{1,})>>/g, '')
			.replace(/<<embed\.thumb:(.{1,})>>/g, '');

		if( IsEmbed ) {
			const Embed = new MessageEmbed( );

			Embed.setTitle(EmbedTitle ? EmbedTitle[1] : 'Bem vindo(a)');
			Embed.setThumbnail(EmbedThumb ? EmbedThumb[1].replace(/<<user.avatar>>/, member.user.displayAvatarURL({ dynamic: true })) : member.user.displayAvatarURL({ dynamic: true }));
			Embed.setColor(`#${EmbedColor ? EmbedColor[1] : '#c3c3c3'}`);
			Embed.setDescription(Message);
			Embed.setFooter(`${member.displayName}`, member.user.displayAvatarURL());

			Channel.send(Embed);
		} else {
			Channel.send(Message);
		};

	} catch ( error ) {
		console.error ( error );
	};
});

client.on('message', async function( message ) {
	if(! message.author || message.author.bot || message.channel.type == 'dm' ) return;

	let Guild = Guilds[ message.guild.id ];
	let User = Users[ message.author.id ];

	if(! Guild ) {
		Guild = CreateGuild( message.guild.id );
		await Save('guilds.json', Guilds);
	};

	if(! User ) {
		User = CreateUser( message.author.id );
		await Save('users.json', Users);
	};

	const mention = message.mentions.users.first( );

	if( mention && Users[ mention.id ] && Users[ mention.id ].profile.afk ) {
		message.reply(`esse **usuario** esta afk\n**mensagem**: ${Users[ mention.id ].profile.afk}`);
	};

	if( User.profile.afk ) {
		User.profile.afk = false;

		message.reply('você nao esta mais afk');

		await Save('users.json', Users);
	};

    if(! message.content.startsWith(Guild.prefix) ) return;

    const args = message.content.slice(Guild.prefix.length).split(' ');
    const cmdName = args.shift( ).toLowerCase( );

    if(! cmdName ) return message.reply('você precisa colocar o nome de um comando');

    const cmd = client.commands.get(cmdName) || client.commands.find(c => c.aliases && c.aliases.includes( cmdName ));
    console.log(`comando: ${cmd.name} executado por ${message.author.username} no servidor ${message.guild.name};\nargs: ${args.join(' ')}`);
	if(! cmd ) return message.reply('comando não encontrado');

	if( cmd.permissions && !message.member.hasPermission(cmd.permissions) ) return message.reply('você nao tem permissão para executar esse comando');
	if( cmd.nsfw && !message.channel.nsfw ) return message.reply('você precisa estar em um canal com conteudo adulto ativo para executar esse comando');
	if( cmd.onlyOwner && message.author.id != '645006536204091412' ) return message.reply('apenas meu dono pode usar esse comando');

	try {
   cmd.execute(client, message, args);
	} catch ( error ) {
		console.error ( error );
		message.reply('ocorreu um erro durante a execução do comando');
	}
});



client.on("message", async message => {
	const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
	if (regex.exec(message.content)) {
	  await message.delete({timeout: 1000});
		await message.channel.send(
		  `${message.author} **você não pode postar link de outros servidores aqui!**`
		);
	}
  });
  


  client.on('message', message => {
	if (message.author.bot) return;
	if (message.channel.type == 'dm') return;

	 if (message.mentions.has(client.user)) { 
	   const mencionada = new MessageEmbed() .setDescription(`Olá, ${message.author}, Use \`!help\` para ver meus comandos ;)`)
	   .setColor('BLUE')
	 message.channel.send(mencionada);
	 }})

	 

client.login( token )