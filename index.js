require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    SlashCommandBuilder,
    REST,
    Routes,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, () => {
    console.log(`Bot login sebagai ${client.user.tag}`);
});

/* ================= REGISTER SLASH COMMAND ================= */

const commands = [
    new SlashCommandBuilder()
        .setName('role')
        .setDescription('Pilih role gender')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('Slash command berhasil didaftarkan');

    } catch (err) {
        console.error(err);
    }
})();

/* ================= SLASH COMMAND ================= */

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'role') {

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("Get RolebyFii")
                .setDescription("Klik tombol di bawah untuk memilih **role gender** kamu.")
                .setThumbnail("https://i.ibb.co.com/sJgL5vwR/static.png") // Ganti dengan URL gambarmu
                .setFooter({ text: "AfkVoicebyFii Role Panel" });

            const row = new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setCustomId('man_role')
                    .setLabel('MAN 💪')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('woman_role')
                    .setLabel('WOMAN 🌸')
                    .setStyle(ButtonStyle.Secondary)

            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        }

    }

    /* ================= BUTTON HANDLER ================= */

    if (interaction.isButton()) {

        const member = interaction.member;

        try {

            if (interaction.customId === 'man_role') {

                await member.roles.remove(process.env.WOMAN_ROLE_ID);
                await member.roles.add(process.env.MAN_ROLE_ID);

                await interaction.reply({
                    content: 'Role **MAN 💪** berhasil diberikan',
                    ephemeral: true
                });

            }

            if (interaction.customId === 'woman_role') {

                await member.roles.remove(process.env.MAN_ROLE_ID);
                await member.roles.add(process.env.WOMAN_ROLE_ID);

                await interaction.reply({
                    content: 'Role **WOMAN 🌸** berhasil diberikan',
                    ephemeral: true
                });

            }

        } catch (err) {

            console.error(err);

            await interaction.reply({
                content: 'Terjadi kesalahan saat memberi role.',
                ephemeral: true
            });

        }

    }

});

client.login(process.env.TOKEN);
