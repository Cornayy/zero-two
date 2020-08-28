import { RichEmbed } from 'discord.js';
import { IBotClient } from '../types';

export class EmbedBuilder {
    private embed: RichEmbed;
    private client: IBotClient;

    constructor(client: IBotClient) {
        this.client = client;
    }

    private setEmbed(): void {
        this.embed = new RichEmbed()
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
