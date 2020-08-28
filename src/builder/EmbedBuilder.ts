import { RichEmbed } from 'discord.js';
import { IBotClient } from '../types';

export class EmbedBuilder {
    private embed: RichEmbed;
    private client: IBotClient;

    constructor(client: IBotClient) {
        this.client = client;
        this.setEmbed();
    }

    private setEmbed(): void {
        this.embed = new RichEmbed()
            .setDescription(
                `You can check the usage of a command with the ${this.client.settings.prefix}usage command.`
            )
            .setColor(0x00b405)
            .setFooter(
                `${this.client.user.username} at ${new Date().toDateString()}`,
                this.client.user.avatarURL
            );
    }

    public getEmbed(): RichEmbed {
        this.setEmbed();
        return this.embed;
    }
}
