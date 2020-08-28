import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient } from '../types';

export default class Help extends Command {
    constructor(client: IBotClient) {
        super(client, {
            name: 'help',
            description: 'Displays all the commands.',
            category: 'Information',
            usage: client.settings.prefix.concat('help'),
            cooldown: 1000,
            requiredPermissions: ['READ_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const { commands } = this.client;
        const embed = this.client.builder
            .getEmbed()
            .setTitle('Help')
            .setDescription(
                `You can check the usage of a command with the ${this.client.settings.prefix}usage command.`
            );

        commands.forEach((command: Command) =>
            embed.addField(command.conf.name, `*${command.conf.usage}*`, true)
        );

        await super.respond(message.channel, embed);
    }
}
