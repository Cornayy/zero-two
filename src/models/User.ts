import { Schema } from 'mongoose';
import { IUser } from '../types';

export const User = new Schema<IUser>({
    id: String,
    nickname: String
});
