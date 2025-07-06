import { ContainerBuilder, InteractionReplyOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, } from "discord.js";

const display = new ContainerBuilder()
    .setAccentColor(0x402d00)
    .addTextDisplayComponents(textDisplay => textDisplay
        .setContent('🌐 Escolha como deseja pesquisar')
    )
    .addActionRowComponents(
        actionRow => actionRow
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selection')
                    .setPlaceholder('Escolha')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Listar todos')
                            .setValue('all'),

                        new StringSelectMenuOptionBuilder()
                            .setLabel('Pesquisar por palavra')
                            .setValue('search')
                    )
            )
    );

export const searchTypeSelection = {
    components: [display],
    flags: MessageFlags.IsComponentsV2,
    withResponse: true
} as InteractionReplyOptions

