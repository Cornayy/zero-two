import { Collection, Client as DiscordClient, GuildMember, PermissionString } from 'discord.js';
import { loadEvents } from './loaders/EventLoader';
import { getCommands } from './loaders/CommandLoader';
import { ISettings, IBotClient } from './types';
import { Command } from './Command';
import { EmbedBuilder } from './builder/EmbedBuilder';
import { createDatabaseConnection } from './utils/database';

export class Client extends DiscordClient implements IBotClient {
    public settings: ISettings;
    public commands: Collection<string, Command>;
    public builder: EmbedBuilder;

    public constructor(settings: ISettings) {
        super(settings.clientOptions || {});

        this.settings = settings;
        this.settings.token = process.env.BOT_TOKEN;
        this.commands = getCommands(this);

        loadEvents(this);
        createDatabaseConnection();

        this.login(settings.token).then(() => {
            this.builder = new EmbedBuilder(this);
        });
    }

    public userHasPermission(user: GuildMember, requiredPermissions: PermissionString[]): boolean {
        return user.hasPermission(requiredPermissions, false, true, true);
    }
}
