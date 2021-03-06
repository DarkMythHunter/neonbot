#!/usr/bin/env node

/*
      _ _                       _       _       _                                
   __| (_)___  ___ ___  _ __ __| |     | |_ ___| | ___  __ _ _ __ __ _ _ __ ___  
  / _` | / __|/ __/ _ \| '__/ _` |_____| __/ _ \ |/ _ \/ _` | '__/ _` | '_ ` _ \ 
 | (_| | \__ \ (_| (_) | | | (_| |_____| ||  __/ |  __/ (_| | | | (_| | | | | | |
  \__,_|_|___/\___\___/|_|  \__,_|      \__\___|_|\___|\__, |_|  \__,_|_| |_| |_|
                                                       |___/
  _          _     _            
 | |__  _ __(_) __| | __ _  ___ 
 | '_ \| '__| |/ _` |/ _` |/ _ \
 | |_) | |  | | (_| | (_| |  __/
 |_.__/|_|  |_|\__,_|\__, |\___|
                     |___/
*/


// clear console before start -- useful for debugging, disabled from ver 1.0.1
// console.clear()

// import env variables
var telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
var telegramChatId = process.env.TELEGRAM_CHAT_ID;
var discordChannelId = process.env.DISCORD_CHANNEL_ID;
const PORT = process.env.PORT || 3000;
const DYNO_URL = process.env.DYNO_URL || "https://google.com";

const fetch = require("node-fetch");

const wakeUpDyno = (url, interval = 25, callback) => {
  const milliseconds = interval * 60000;
  setTimeout(() => {
    try {
      console.log("setTimeout called.");
      // HTTP GET request to the dyno's url
      fetch(url).then(() => console.log(`Fetching ${url}.`));
    } catch (err) {
      // catch fetch errors
      console.log(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
    } finally {
      try {
        callback(); // execute callback, if passed
      } catch (e) {
        // catch callback error
        callback ? console.log("Callback failed: ", e.message) : null;
      } finally {
        // do it all again
        return wakeUpDyno(url, interval, callback);
      }
    }
  }, milliseconds);
};


/*async def members():
    activeGuilds = bot.guilds
    channel = bot.get_channel(<755395214964686898>)
    sum = 0
    for s in activeGuilds:
        sum += len(s.members)
    await channel.edit(name='❎ MEMBERS: {} ❎'.format(int(sum)))
    await asyncio.sleep(1)

@bot.event
async def on_member_join(member):
    await members()

@bot.event
async def on_member_remove(member):
    await members()*/

// import modules
const Discord = require("discord.js");
const client = new Discord.Client();
const Telegram = require("telegraf/telegram");
const polka = require("polka");
const { Telegraf } = require("telegraf");

polka()
  .get("/", (req, res) => {
    res.end("Hello world!");
  })
  .listen(PORT, (err) => {
    if (err) {
      throw err;
    }
    console.log("> Running on localhost:" + PORT);
    if (process.env._ && process.env._.indexOf("heroku") !== -1) {
      console.log("> Starting wakeUpDyno");
      wakeUpDyno(DYNO_URL);
    } else {
      console.log("> Not running on heroku");
    }
  });

const webhookClient = new Discord.WebhookClient(
  process.env.webhook_id,
  process.env.webhook_token
);

// initializes the telegram bot and starts listening for updates (new messages)

const bot = new Telegraf(telegramToken);
client.once("ready", () => {
  console.log("Discord bot ready!");
});

//Wake's up the bot
var reqTimer = setTimeout(function wakeUp() {
   request("https://nameless-gorge-19527.herokuapp.com", function() {
      console.log("WAKE UP DYNO");
   });
   return reqTimer = setTimeout(wakeUp, 1200000);
}, 1200000);

// initializes discord bot
client.login(DISCORD_TOKEN);

// if the discord bot receives a message
client.on("message", (message) => {
  if (
    // the program currently check if the message's from a bot to check for duplicates. This isn't the best method but it's good enough. A webhook counts as a bot in the discord api, don't ask me why.
    message.channel.id == discordChannelId &&
    message.author.bot === false
  ) {
    const mentionedUsernames = [];
    for (const mention of message.mentions.users) {
      mentionedUsernames.push("@" + mention[1].username);
    }
    var attachmentUrls = [];
    for (const attachment of message.attachments) {
      attachmentUrls.push(attachment[1].url);
    }
    // attachmentUrls is empty when there are no attachments so we can be just lazy
    var finalMessageContent = message.content.replace(/<@.*>/gi, "");
    bot.telegram.sendMessage(
      telegramChatId,
      message.author.username +
        ": " +
        finalMessageContent +
        " " +
        attachmentUrls.join(" ") +
        mentionedUsernames.join(" ")
    );
  }
});

var photoUrl = "";
bot.on("message", function (message) {
  const messageUpdate = message.update;
  const updateMsg = message.update.message;
  var filePath = "";
  if (updateMsg.chat.id == telegramChatId && updateMsg.from.is_bot === false) {
    // this part gets the user profile photos as the variable names suggest
    const getProfilePic = new Promise(function (resolve, reject) {
      var profilePhotos = bot.telegram.getUserProfilePhotos(updateMsg.from.id);
      profilePhotos.then(function (data) {
        // if user has a profile photo
        // console.log(data)
        if (data.total_count > 0) {
          var file = bot.telegram.getFileLink(data.photos[0][0].file_id);
          file.then(function (result) {
            resolve(result);
          });
        } else {
          resolve("https://telegram.org/img/t_logo.png");
        }
      });
    });
    getProfilePic.then(function (profileUrl) {
      // if the message contains media
      if (updateMsg.document || updateMsg.photo || updateMsg.sticker) {
        if (updateMsg.document) {
          bot.telegram
            .getFileLink(updateMsg.document.file_id)
            .then(function (photoUrl) {
              webhookClient.send(updateMsg.caption, {
                username: updateMsg.from.first_name,
                avatarURL: profileUrl,
                files: [photoUrl],
              });
            });
        }

        if (updateMsg.sticker) {
          bot.telegram
            .getFileLink(updateMsg.sticker.file_id)
            .then(function (photoUrl) {
              webhookClient.send(updateMsg.caption, {
                username: updateMsg.from.first_name,
                avatarURL: profileUrl,
                files: [photoUrl],
              });
            });
        }
        if (updateMsg.photo) {
          bot.telegram
            .getFileLink(updateMsg.photo[0].file_id)
            .then(function (photoUrl) {
              webhookClient.send(updateMsg.caption, {
                username: updateMsg.from.first_name,
                avatarURL: profileUrl,
                files: [photoUrl],
              });
            });
        }
      } else {
        webhookClient.send(updateMsg.text, {
          username: updateMsg.from.first_name,
          avatarURL: profileUrl,
        });
      }
    });
  }
});
bot.launch();
