import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient } from '../types';
import { fetchUrl, getContent } from '../utils/scraping';
import { Guild } from '../models/Guild';
import { Logger } from '../utils/Logger';

export default class Characters extends Command {
    private BASE_URL = 'https://account.ankama.com/en/ankama-profile/';

    constructor(client: IBotClient) {
        super(client, {
            name: 'characters',
            description: 'Get all the characters of the entered Ankama nickname',
            category: 'Information',
            usage: client.settings.prefix.concat('characters @user'),
            cooldown: 1000,
            requiredPermissions: ['READ_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const member = message.mentions.members.first();

        if (!member) {
            await super.respond(message.channel, 'You have not specified a member.');
            throw new Error('No Ankama nickname specified.');
        }

        try {
            const guild = await Guild.findOne({ id: message.guild.id }).exec();
            if (!guild) {
                await super.respond(
                    message.channel,
                    'No registered server was found for the mentioned user.'
                );
                return;
            }

            const user = guild.users.find(({ id }) => id === member.id);
            if (!user) {
                await super.respond(
                    message.channel,
                    'No nickname was found for the mentioned user.'
                );
                return;
            }

            const content = await fetchUrl(this.BASE_URL.concat(user.nickname));
            const selector = getContent(content);
            const characters = selector('table[class="ak-container ak-table ak-responsivetable"]')
                .text()
                .split('\n')
                .filter(char => char);
            const embed = this.client.builder.getEmbed().setTitle(`Characters: ${user.nickname}`);

            characters.forEach(character => {
                const name = character.split(' ').shift();
                const rest = character
                    .split(' ')
                    .slice(1)
                    .join(' ');
                embed.addField(name, rest, true);
            });

            await super.respond(message.channel, embed);
        } catch (err) {
            Logger.error(err);
        }
    }
}
