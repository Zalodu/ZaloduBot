var Stats = require("./stats.js");
var fs = require("fs");

var serverconfigFilePath = "./serverconfig.json";
try {
  Serverconfig = require(serverconfigFilePath);
} catch (e) {
  /* Create empty serverconfig file if there's no serverconfig file */
  Serverconfig = {};
  fs.writeFile(serverconfigFilePath, JSON.stringify(stats, null, 2), function (err) {
    if (err) { return console.log(err); }
  });
}

console.log("Starting ZaloduBot...");
try {
  var Discord = require("discord.js");
} catch (e) {
  console.log(e.stack);
  console.log(process.version);
  process.exit();
}

console.log("Authenticating...");
try {
  var authentication = require("./auth.json");
} catch (e) {
  console.log("Missing auth.json: " + e);
  process.exit();
}

var startTime = Date.now(); //use client.uptime instead??
var bot = new Discord.Client();

console.log("Logging in...");
bot.login(authentication.bot_token);


bot.on("ready", function () {
  var guildsArray = bot.guilds.array();
  console.log("Bot is alive! Serving " + guildsArray.length + " servers.");

  bot.user.setStatus("online");

  Stats.initStats(guildsArray);
});

bot.on("disconnected", function () {
  console.log("Bot disconnected");
  process.exit(1); //exits node.js with an error
});


bot.on("message", function (message) {
  //if (!message.author.bot && message.content[0] == Serverconfig.guilds[message.guild.id].commandPrefix && message.content.length > 1) {
  if (!message.author.bot && message.content[0] == "!" && message.content.length > 1) {
    var command = message.content.split(" ")[0].slice(1);
    var params = message.content.split(" ").slice(1);
    var mentions = message.mentions;

    /*
    console.log(message.content);
    console.log(command);
    console.log(params);
    */

    // Set up serverconfig
    /*
    if (command == "setup") {
      if(hasPermission(message)) {
        //Start some kind of conversation mode? Locked to the one user?
        message.channel.sendMessage("");
      }
      else {
        message.channel.sendMessage("Access denied.");
      }
    }
    */
    // Restarts the bot
    if (command == "restart") {

    }
    // Outputs the amount of channels the bot has access to in the server
    else if (command == "channels") {
    /*
      var channels = message.guild.channels.filter(function (c) {
        return c.permissionsFor(bot.user).serialize()["READ_MESSAGES"];
      });

      message.channel.sendMessage("Able to track statistics for " + channels.array().length + " channels on this server.");
    }
    */
    }

    // Looks up and returns all known usernames and nicknames for the given user
    else if (command == "displaynames") {
      var userId;
      console.log("Has id: " + message.guild.members.hasOwnProperty(params[0]));
      console.log(message.guild.members[0].id);
      console.log("Has displayname: " + message.guild.members.find(function (member) { return member.displayname == params[0]; }));
      // if user is mentioned
      if (mentions.users.array().length > 0) {
        userId = mentions.users.array()[0].id;
        //message.channel.sendMessage("User " + mentions.users.array()[0].username + " found on this server.");
      }
      // if parameter is a user id
      else if (message.guild.members.hasOwnProperty(params[0])) {
        message.channel.sendMessage("User id " + params[0] + " found on this server.");
      }
      // if parameter is a user displayname
      else if (message.guild.members.find(function (member) { return member.displayname == params[0]; })) {
        message.channel.sendMessage("User " + params[0] + " found on this server.");
      }

    }
    // Finds all users that have used the given displayname
    else if (command == "") {

    }
  }
  /* let's focus on config for now
  if(!message.author.bot) {
    Stats.incrementCount(message);
  }
  */
});


bot.on("channelCreate", function (channel) {
  if (channel.type == "text") {
    Stats.channelCreate(channel); 
  }
});

bot.on("channelUpdate", function (oldChannel, newChannel) {
  if (oldChannel.type == "text") {
    Stats.channelUpdate(oldChannel, newChannel);
  }
});


bot.on("guildMemberUpdate", function (oldMember, newMember) {
  Stats.guildMemberUpdate(oldMember, newMember);
});

bot.on("userUpdate", function (oldUser, newUser) {
  Stats.userUpdate(oldUser, newUser);
});

/*  not necessary atm
function hasPermission(message) {
  if (message.author.id == message.guild.owner.id || author has admin permission node || author has one dev role) {

  }
}*/
