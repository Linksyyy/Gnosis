import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Message,
} from "discord.js";
import type { Command } from "../../conf/types/Command.ts";

async function fetchAndBuildEmbed(
  serverAddress: string
): Promise<EmbedBuilder | null> {
  const url = `https://api.mcstatus.io/v2/status/java/${serverAddress}`;

  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data.online) {
    const embed = new EmbedBuilder()
      .setTitle(`Status do Servidor: ${data.host}`)
      .setColor("Green")
      .setTimestamp()
      .addFields(
        { name: "Status", value: "Online", inline: true },
        {
          name: "Jogadores",
          value: `${data.players.online}/${data.players.max}`,
          inline: true,
        },
        { name: "Versão", value: data.version.name_clean, inline: true },
        { name: "MOTD", value: data.motd.clean }
      );

    //if (data.icon) {
    //  embed.setThumbnail(data.icon);
    //}

    if (data.players.list && data.players.list.length > 0) {
      const playerList = data.players.list
        .map((p: any) => p.name_clean)
        .join("\n");
      embed.addFields({
        name: `Jogadores Online (${data.players.online}):`,
        value: playerList,
      });
    } else if (data.players.online > 0) {
      // If list is not provided but player count is > 0
      embed.addFields({
        name: "Jogadores Online",
        value: "A lista de jogadores não está disponível.",
      });
    }

    return embed;
  } else {
    return new EmbedBuilder()
      .setTitle(`Status do Servidor: ${serverAddress}`)
      .setColor("Red")
      .setTimestamp()
      .setDescription("O servidor está offline.");
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription(
      "Verifica o status de um servidor de Minecraft e atualiza a cada 10 segundos."
    )
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setDescription("O endereço do servidor de Minecraft")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const serverAddress = interaction.options.getString("servidor", true);

    try {
      const initialEmbed = await fetchAndBuildEmbed(serverAddress);
      if (!initialEmbed) {
        await interaction.editReply(
          "Não foi possível encontrar o servidor. Verifique o endereço e tente novamente."
        );
        return;
      }

      const message = await interaction.editReply({ embeds: [initialEmbed] });

      const interval = setInterval(async () => {
        const newEmbed = await fetchAndBuildEmbed(serverAddress);
        if (newEmbed) {
          await message.edit({ embeds: [newEmbed] }).catch(console.error);
        } else {
          // If fetch fails (e.g. server goes down), stop interval
          clearInterval(interval);
          const errorEmbed = new EmbedBuilder()
            .setTitle("Erro na Atualização")
            .setColor("Yellow")
            .setDescription(
              `Não foi possível obter o status de **${serverAddress}**. A atualização automática foi parada.`
            );
          await message.edit({ embeds: [errorEmbed] }).catch(console.error);
        }
      }, 5 * 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        `Ocorreu um erro ao verificar o status do servidor: ${serverAddress}. Verifique se o endereço está correto.`
      );
    }
  },
} as Command;
