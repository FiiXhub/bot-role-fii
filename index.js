require('dotenv').config();

const {
Client,
GatewayIntentBits,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
Events,
EmbedBuilder
} = require('discord.js');

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});

/* ================= BOT READY ================= */

client.once(Events.ClientReady, async () => {

console.log(`Bot login sebagai ${client.user.tag}`);

/* CHANNEL PANEL */

const channel = await client.channels.fetch(process.env.ROLE_CHANNEL_ID);

/* EMBED PANEL */

const embed = new EmbedBuilder()
.setColor("#5865F2")
.setTitle("Get RolebyFii")
.setDescription("Klik tombol untuk mengambil role.")
.setThumbnail("https://i.ibb.co.com/sJgL5vwR/static.png")
.setFooter({ text: "AfkVoicebyFii Role Panel" });

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId('man_role')
.setLabel('MAN 💪')
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId('woman_role')
.setLabel('WOMAN 🌸')
.setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
.setCustomId('gaming_role')
.setLabel('GAMING 🎮')
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId('admin_role')
.setLabel('ADMIN 👑')
.setStyle(ButtonStyle.Danger)

);

/* KIRIM PANEL */

channel.send({
embeds: [embed],
components: [row]
});

});

/* ================= BUTTON ================= */

client.on(Events.InteractionCreate, async interaction => {

if (!interaction.isButton()) return;

const member = interaction.member;

/* ================= MAN ================= */

if (interaction.customId === 'man_role') {

await member.roles.remove(process.env.WOMAN_ROLE_ID);
await member.roles.add(process.env.MAN_ROLE_ID);

return interaction.reply({
content: 'Role **MAN 💪** berhasil diberikan',
ephemeral: true
});

}

/* ================= WOMAN ================= */

if (interaction.customId === 'woman_role') {

await member.roles.remove(process.env.MAN_ROLE_ID);
await member.roles.add(process.env.WOMAN_ROLE_ID);

return interaction.reply({
content: 'Role **WOMAN 🌸** berhasil diberikan',
ephemeral: true
});

}

/* ================= GAMING ================= */

if (interaction.customId === 'gaming_role') {

await member.roles.add(process.env.GAMING_ROLE_ID);

return interaction.reply({
content: 'Role **GAMING 🎮** berhasil diberikan',
ephemeral: true
});

}

/* ================= ADMIN REQUEST ================= */

if (interaction.customId === 'admin_role') {

const verifyRow = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId(`approve_admin_${member.id}`)
.setLabel('Approve Admin')
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId(`deny_admin_${member.id}`)
.setLabel('Tolak')
.setStyle(ButtonStyle.Danger)

);

const embed = new EmbedBuilder()
.setColor("Yellow")
.setTitle("Request Role Admin")
.setDescription(`${member} meminta **ROLE ADMIN**.\n\nMenunggu verifikasi dari **DEV**.`);

await interaction.reply({
content: "Request admin dikirim ke DEV.",
ephemeral: true
});

const msg = await interaction.channel.send({
content: `<@&${process.env.DEV_ROLE_ID}>`,
embeds: [embed],
components: [verifyRow]
});

/* AUTO DELETE CHAT BOT */

setTimeout(() => {
msg.delete().catch(() => {});
}, 10000);

}

/* ================= APPROVE ADMIN ================= */

if (interaction.customId.startsWith("approve_admin_")) {

if (!interaction.member.roles.cache.has(process.env.DEV_ROLE_ID)) {

return interaction.reply({
content: "Hanya **DEV** yang bisa approve.",
ephemeral: true
});

}

const userId = interaction.customId.split("_")[2];

const guild = interaction.guild;
const target = await guild.members.fetch(userId);

await target.roles.add(process.env.ADMIN_ROLE_ID);

await interaction.update({
content: `✅ ${target} sekarang menjadi **ADMIN**`,
embeds: [],
components: []
});

}

/* ================= DENY ADMIN ================= */

if (interaction.customId.startsWith("deny_admin_")) {

if (!interaction.member.roles.cache.has(process.env.DEV_ROLE_ID)) {

return interaction.reply({
content: "Hanya **DEV** yang bisa menolak.",
ephemeral: true
});

}

const userId = interaction.customId.split("_")[2];

const guild = interaction.guild;
const target = await guild.members.fetch(userId);

await interaction.update({
content: `❌ Permintaan admin dari ${target} ditolak.`,
embeds: [],
components: []
});

}

});

client.login(process.env.TOKEN);
