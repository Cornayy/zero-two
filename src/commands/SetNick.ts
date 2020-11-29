import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient, IGuild } from '../types';
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

    private async getGuild(id: string): Promise<IGuild | null> {
        let guild = await Guild.findOne({ id }).exec();
        if (!guild) guild = await Guild.create({ _id: id, users: [] });

        return guild;
    }

    private async setNickname(guild: IGuild, nickname: string, id: string): Promise<void> {
        const user = guild.users.find(user => user.id === id);

        if (user) {
            user.nickname = nickname;
        } else {
            guild.users.push({ id, nickname });
        }

        await guild.updateOne({ id: guild.id, users: guild.users });
    }

    public async run(message: Message, args: any[]): Promise<void> {
        const [nickname] = args;
        const { member } = message;
        const { id } = member.guild;

        if (!nickname) {
            await super.respond(message.channel, 'You have not specified a nickname.');
            return;
        }

        const guild = await this.getGuild(id);
        if (!guild) return;

        await this.setNickname(guild, nickname, member.id);
        await super.respond(message.channel, 'Nickname set!');
    }
}
