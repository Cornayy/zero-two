import * as dotenv from 'dotenv';
import { settings } from './config/config';
import { Client } from './Client';

dotenv.config();

new Client(settings);
