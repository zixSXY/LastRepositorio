const Canvas = require('canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');

const command = { };

command.name = 'ship';
command.type = 'Diversão';
command.description = 'Forma um casal';

command.execute = async function(client, message, args) {
    const screen = Canvas.createCanvas(384, 128);
    const context = screen.getContext('2d');

    const firstMember = message.mentions.users.first( ) || message.author;
    const secondMember = message.mentions.users.last( ) || message.author;

    const loveRate = Math.floor(Math.random( ) * 100);

    const images = {
        hearth: 'https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_2.png?v=1593651528429',
        know: 'https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_3-1.png?v=1593652255529',
        cry: 'https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_1.png?v=1593651511900'
    };

    const contents = {
        description: null,
        emote: null
    };

    if( loveRate <= 25 ) contents.emote = await Canvas.loadImage(images['cry']);
    else if ( loveRate <= 75 ) contents.emote = await Canvas.loadImage(images['know']);
    else contents.emote = await Canvas.loadImage(images['hearth']);

    const firstMemberAvatar = await Canvas.loadImage(firstMember.displayAvatarURL({ format: 'png' }));
    const secondMemberAvatar = await Canvas.loadImage(secondMember.displayAvatarURL({ format: 'png' }));

    context.drawImage(firstMemberAvatar, 0, 0, 128, 128);
    context.drawImage(contents.emote, 128, 0, 128, 128);
    context.drawImage(secondMemberAvatar, 256, 0, 128, 128);

    const attch = new MessageAttachment(screen.toBuffer( ), 'ship.png');

    message.channel.send( `${firstMember} + ${secondMember} %${loveRate} `, attch );
};

  
module.exports = command;