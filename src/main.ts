import axios from 'axios';
import UserAgent from 'user-agents';
import { SendMessageResponse } from './types';
import { PROXY_CONFIG, COOKIE } from './config';

axios.defaults.proxy = PROXY_CONFIG;
axios.defaults.headers.common['User-Agent'] = new UserAgent({ deviceCategory: 'desktop' }).toString();
axios.defaults.headers.common['Cookie'] = `.ROBLOSECURITY=${COOKIE}`
axios.interceptors.response.use(
    // i love axios
    (res) => res,
    (error) => {
        if (!error.config) return Promise.reject(error);

        if (error.response && error.response.status === 403) {
            const csrfToken = error.response.headers['x-csrf-token'];
            if (!csrfToken) return Promise.reject(error);

            axios.defaults.headers.common['x-csrf-token'] = csrfToken;

            return axios(error.config);
        } else {
            return Promise.reject(error);
        }
    }
);

const sendMessage = async (receipient: number, body: string, subject: string): Promise<SendMessageResponse> => {
    const res = await axios.post('https://privatemessages.roblox.com/v1/messages/send', {
        cacheBuster: new Date().getTime(),
        recipientid: receipient,
        subject,
        body
    });

    return res.data;
}

const loop = async () => {
    const res = await sendMessage(71719267, 'Hello test message', 'this');

    console.log(res)
}

loop();