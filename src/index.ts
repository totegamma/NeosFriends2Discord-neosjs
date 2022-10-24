import { v4 } from 'uuid'
import { Message, Client, TextChannel } from 'discord.js'
import { CloudXInterface, Friend } from "@bombitmanbomb/cloudx"

const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? "";
const NEOS_USERNAME = process.env.NEOS_USERNAME ?? "";
const NEOS_PASSWORD = process.env.NEOS_PASSWORD ?? "";
const DISCORD_CHANNELID = process.env.DISCORD_CHANNELID ?? "";
const DISCORD_MESSAGEID = process.env.DISCORD_MESSAGEID ?? "";

let cloudx = new CloudXInterface(null);
let discord = new Client({intents: []});

let message: Message;

let login = async() => {
    discord.login(DISCORD_TOKEN)
    await cloudx.Login(NEOS_USERNAME, NEOS_PASSWORD, null, v4(), false, null);
}

discord.once('ready', async () => {
    console.log(`Logged in as ${discord.user?.tag}!`);
    let channel = await discord.channels.fetch(DISCORD_CHANNELID) as TextChannel;
    message = await channel.messages.fetch(DISCORD_MESSAGEID);
    setInterval(updateMessage, 60000);
});


let updateMessage = async() => {
    let friends = (await cloudx.GetFriends()).Content as Friend[];

    // Accept Friend Requests
    let pending =  friends.filter((x: Friend) => x.FriendStatus == 'Requested');
    pending.forEach((x: Friend) => cloudx.Friends.AddFriend(x));

    // Update Friendlist
    let newmessage = friends.filter((x: Friend) => x.UserStatus.OnlineStatus != "Offline")
                            .map((x: Friend) => `${x.FriendUsername}: ${x.UserStatus.OnlineStatus}@${x.UserStatus.CurrentSession?.Name ?? "Private"} (${x.UserStatus.OutputDevice})`)
                            .join('\n');
    message.edit(`**ONLINE LIST** (edited: <t:${Math.floor(Date.now()/1000)}:R> )\n` + newmessage);
}

let main = async () => {
    await login();
}

main();

