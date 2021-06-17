const Discord = require('discord.js');
const MessageEmbed = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const auth = require("./auth.json");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', async message => { 
    if (message.channel.type == 'dm') {      
            const embed = new Discord.MessageEmbed()
                .setColor('#F1C40F')
                .setTitle(`${message.author.tag}`) 
                .setDescription(message.content) 
                .setFooter(`${message.author.id}`)
                .setTimestamp();
                client.channels.cache.get('855106161027710986').send(embed);
        } 
}) 

client.on('message', async message => { 
    if (message.channel.type == 'dm') {      
            const embed = new Discord.MessageEmbed()
                .setColor('#F1C40F')
                .setDescription(message.content) 
                client.channels.cache.get('855088827424309268').send(embed);
        } 
});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
