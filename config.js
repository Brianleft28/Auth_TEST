import dotenv from 'dotenv';
dotenv.config();

const config = {
    api: {
        url: process.env.API_URL
    },
    timeout: parseInt(process.env.TIMEOUT)
}

export default config;