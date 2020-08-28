import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient } from '../types';
import { fetchUrl, getContent } from '../utils/scraping';

export default class Characters extends Command {
    private BASE_URL = 'https://account.ankama.com/en/ankama-profile/';

    constructor(client: IBotClient) {
        super(client, {
            name: 'characters',
            description: 'Get all the characters of the entered Ankama nickname',
            category: 'Information',
            usage: client.settings.prefix.concat('characters nickname'),
            cooldown: 1000,
            requiredPermissions: ['READ_MESSAGES']
        });
    }

    public async run(message: Message, args: any[]): Promise<void> {
        const [nickname] = args;

        if (!nickname) {
            await super.respond(message.channel, 'You have not specified an Ankama nickname.');
            throw new Error('No Ankama nickname specified.');
        }

        const content = await fetchUrl(this.BASE_URL.concat(nickname));
        const selector = getContent(content);
        const characters = selector('table[class="ak-container ak-table ak-responsivetable"]')
            .text()
            .split('\n')
            .filter(char => char);
        const embed = this.client.builder.getEmbed().setTitle(`Characters: ${nickname}`);

        characters.forEach(character => {
            const name = character.split(' ').shift();
            const rest = character
                .split(' ')
                .slice(1)
                .join(' ');
            embed.addField(name, rest, true);
        });

        await super.respond(message.channel, embed);
    }
}
