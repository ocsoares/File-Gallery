import 'dotenv/config';
import axios from 'axios';

export const shortURLAPI = async (url: string) => {

    const headers = {
        'Content-Type': 'application/json',
        'apiKey': process.env.REBRANDLY_API_KEY
    };

    const linkRequest = {
        destination: url,
        domain: { fullName: 'rebrand.ly' }
    };

    return await axios({
        url: 'https://api.rebrandly.com/v1/links',
        method: 'POST',
        headers,
        data: linkRequest
    });
};