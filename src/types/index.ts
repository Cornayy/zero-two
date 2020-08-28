import { Document } from 'mongoose';
export * from './bot/Bot';

export interface IUser {
    id: string;
    nickname: string;
}

export interface IGuild extends Document {
    id: string;
    users: IUser[];
}
