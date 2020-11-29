import { Message } from 'discord.js';
import { Command } from '../Command';
import { IBotClient, IUser } from '../types';
import { fetchUrl, getContent } from '../utils/scraping';
import { Guild } from '../models/Guild';

export default class Characters extends Command {
    private GAMES: { [key: string]: string } = {
        '-d': '/dofus',
        '-dt': '/dofustouch',
        '-w': '/wakfu'
    };
    private BASE_URL = 'https://account.ankama.com/en/ankama-profile/';
    private MESSAGES = [
        'You have not specified a member.',
        'No registered server was found for the mentioned user.',
        'No nickname was found for the mentioned user.'
    ];

    constructor(client: IBotClient) {
        super(client, {
            name: 'characters',
            description:
                'Get all the characters of the entered Ankama nickname. [-d, Dofus], [-dt, Dofus Touch], [-w, Wakfu]',
            category: 'Information',
            usage: client.settings.prefix.concat('characters @user or nickname -d, -dt, -w'),
            cooldown: 1000,
            requiredPermissions: ['READ_MESSAGES']
        });
    }

    private async handleChecks(
        message: Message,
        username: string
    ): Promise<IUser | null | undefined> {
        const member = message.mentions.members.first();
        if (!member && username) return;

        const guild = await Guild.findOne({ id: message.guild.id }).exec();
        const foundUser = guild ? guild.users.find(({ id }) => id === member.id) : null;
        const checks = [member, guild, foundUser];

        for (const [index, check] of checks.entries()) {
            if (!check) {
                await super.respond(message.channel, this.MESSAGES[index]);
                break;
            }
        }

        return foundUser;
    }

    private getSuffix(arg: string): string {
        return this.GAMES[arg] || this.GAMES['-d'];
    }

    public async run(message: Message, args: any[]): Promise<void> {
        const [username, option] = args;
        const user = await this.handleChecks(message, username);
        if (!user && !username) return;

        const suffix = this.getSuffix(option);
        const content = await fetchUrl(
            this.BASE_URL.concat(user ? user.nickname : username).concat(suffix)
        );

        if (!content) {
            await super.respond(message.channel, 'This nickname does not exist.');
            return;
        }

        const selector = getContent(content);
        const characters = selector('table[class="ak-container ak-table ak-responsivetable"]')
            .text()
            .split('\n')
            .filter((char: string) => char);
        const embed = this.client.builder
            .getEmbed()
            .setTitle(`Characters: ${user ? user.nickname : username}`);

        characters.forEach((character: string) => {
            const name = character.split(' ').shift();
            const rest = character
                .split(' ')
                .slice(1)
                .join(' ');
            embed.addField(name, rest, false);
        });

        await super.respond(
            message.channel,
            characters.length > 0 ? embed : 'No characters were found for this nickname.'
        );
    }
}
