const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'ping') {
    	message.reply('pong');
  	}
});

client.on('message', message => {
    if (message.content === 'I love you') {
        message.reply('I love you too');
    }
});

client.on('message', message => {
    if (message.content === 'nat') {
        message.reply('gago ka ba');
    }
});

client.on('message', message => {
    if (message.content === 'papy') {
        message.reply('MARK GSAUCE FRIES');
    }
});

client.on('message', message => {
    if (message.content === '!say') {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
