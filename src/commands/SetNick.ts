import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient } from '../types';
import { Logger } from '../utils/Logger';
import { Guild } from '../models/Guild';

export default class SetNick extends Command {
    constructor(client: IBotClient) {
        super(client, {
            name: 'setnick',
            description: 'Sets an Ankama nickname for your discord account.',
            category: 'Information',
            usage: client.settings.prefix.concat('setnick nickname'),
            cooldown: 1000,
            requiredPermissions: ['READ_MESSAGES']
        });
    }

    public async run(message: Message, args: any[]): Promise<void> {
        const [nickname] = args;
        const { member } = message;

        if (!nickname) {
            await super.respond(message.channel, 'You have not specified a nickname.');
            return;
        }

        try {
            const { id } = member.guild;
            let guild = await Guild.findOne({ id }).exec();

            if (!guild) {
                guild = await Guild.create({ id, users: [] });
            }

            const user = guild.users.find(({ id }) => id === member.id);
            if (user) {
                user.nickname = nickname;
            } else {
                guild.users.push({ id: member.id, nickname });
            }

            await guild.save();
            await super.respond(message.channel, 'Nickname set!');
        } catch (err) {
            await super.respond(
                message.channel,
                'Something went wrong while setting your nickname.'
            );
            Logger.error(err);
        }
    }
}
