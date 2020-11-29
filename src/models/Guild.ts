import { Schema, model } from 'mongoose';
import { IGuild } from '../types';
import { User } from './User';

const guildSchema = new Schema<IGuild>({
    id: String,
    users: [User]
});

export const Guild = model<IGuild>('Guild', guildSchema);
