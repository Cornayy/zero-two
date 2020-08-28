import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient } from '../types';

export default class Usage extends Command {
    constructor(client: IBotClient) {
        super(client, {
            name: 'usage',
            description: 'Shows the usage of a command',
            category: 'Information',
            usage: client.settings.prefix.concat('usage'),
            cooldown: 1000,
            requiredPermissions: ['READ_MESSAGES']
        });
    }

    public async run(message: Message, args: any[]): Promise<void> {
        const [command] = args;
        const cmd: Command = this.client.commands.find((cmd: Command) => cmd.conf.name === command);

        if (!cmd) {
            await super.respond(message.channel, 'Could not find that command.');
            return;
        }

        const embed = this.client.builder
            .getEmbed()
            .setTitle(`Usage for: **${cmd.conf.name}**`)
            .setDescription(cmd.conf.description)
            .addField('Category', cmd.conf.category, true)
            .addField('Usage', cmd.conf.usage, true);

        await super.respond(message.channel, embed);
    }
}
