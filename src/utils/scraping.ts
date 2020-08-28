import axios from 'axios';
import { load } from 'cheerio';

export const fetchUrl = async (url: string): Promise<any> => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        console.error(`Error fetching: ${url}`);
    }
};

export const getContent = (content: string): CheerioStatic => {
    return load(content);
};
