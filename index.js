import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";

// Load counter from file or start at 0
var cameronWinter = 0;
try {
  const data = fs.readFileSync("counter.txt", "utf8");
  cameronWinter = parseInt(data) || 0;
} catch (err) {
  // File doesn't exist yet, start with 0
  cameronWinter = 0;
}

// Load trigger words from file
const triggerWords = fs
  .readFileSync("triggers.txt", "utf8")
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => word.length > 0); // Remove empty lines

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("Client is ready");
});

client.on("messageCreate", (message) => {
  // Ignore messages from bots (including itself)
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes("open.spotify.com")) {
    const spotifyLink = message.content.match(
      /https:\/\/open\.spotify\.com\/[^\s]+/
    )?.[0];
    if (spotifyLink) {
      message.reply(
        `${spotifyLink.replace("open.spotify.com", "player.spotify.com")}`
      );
      return;
    }
  }
});

client.on("messageCreate", (message) => {
  // Ignore messages from bots (including itself)
  if (message.author.bot) return;

  const messageContent = message.content.toLowerCase();
  if (triggerWords.some((word) => messageContent.includes(word))) {
    cameronWinter++;
    message.reply(`cameron winter counter: ${cameronWinter}`);
  }
});

// Add shutdown handler
process.on("SIGINT", () => {
  fs.writeFileSync("counter.txt", cameronWinter.toString());
  process.exit();
});

process.on("SIGTERM", () => {
  fs.writeFileSync("counter.txt", cameronWinter.toString());
  process.exit();
});

client.login(process.env.DISCORD_TOKEN);
