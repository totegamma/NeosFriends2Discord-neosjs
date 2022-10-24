"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const discord_js_1 = require("discord.js");
const cloudx_1 = require("@bombitmanbomb/cloudx");
//const fs = require('fs')
const fs_1 = __importDefault(require("fs"));
const livenessPath = '/tmp/healthy';
const DISCORD_TOKEN = (_a = process.env.DISCORD_TOKEN) !== null && _a !== void 0 ? _a : "";
const NEOS_USERNAME = (_b = process.env.NEOS_USERNAME) !== null && _b !== void 0 ? _b : "";
const NEOS_PASSWORD = (_c = process.env.NEOS_PASSWORD) !== null && _c !== void 0 ? _c : "";
const DISCORD_CHANNELID = (_d = process.env.DISCORD_CHANNELID) !== null && _d !== void 0 ? _d : "";
const DISCORD_MESSAGEID = (_e = process.env.DISCORD_MESSAGEID) !== null && _e !== void 0 ? _e : "";
let cloudx = new cloudx_1.CloudXInterface(null);
let discord = new discord_js_1.Client({ intents: [] });
let message;
let login = () => __awaiter(void 0, void 0, void 0, function* () {
    discord.login(DISCORD_TOKEN);
    yield cloudx.Login(NEOS_USERNAME, NEOS_PASSWORD, null, (0, uuid_1.v4)(), false, null);
});
discord.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    console.log(`Logged in as ${(_f = discord.user) === null || _f === void 0 ? void 0 : _f.tag}!`);
    let channel = yield discord.channels.fetch(DISCORD_CHANNELID);
    message = yield channel.messages.fetch(DISCORD_MESSAGEID);
    setInterval(updateMessage, 60000);
}));
let updateMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    let friends = (yield cloudx.GetFriends()).Content;
    // Accept Friend Requests
    let pending = friends.filter((x) => x.FriendStatus == 'Requested');
    pending.forEach((x) => cloudx.Friends.AddFriend(x));
    // Update Friendlist
    let newmessage = friends.filter((x) => x.UserStatus.OnlineStatus != "Offline")
        .map((x) => { var _a, _b; return `${x.FriendUsername}: ${x.UserStatus.OnlineStatus}@${(_b = (_a = x.UserStatus.CurrentSession) === null || _a === void 0 ? void 0 : _a.Name) !== null && _b !== void 0 ? _b : "Private"} (${x.UserStatus.OutputDevice})`; })
        .join('\n');
    message.edit(`**ONLINE LIST** (edited: <t:${Math.floor(Date.now() / 1000)}:R> )\n` + newmessage);
    fs_1.default.closeSync(fs_1.default.openSync(livenessPath, 'w'));
});
let main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield login();
});
main();
