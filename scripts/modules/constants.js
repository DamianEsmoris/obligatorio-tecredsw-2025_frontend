import { userToken } from "./userMangement.js";

const TASK_API_URL = 'http://192.168.122.2:30001';
const OAUTH_API_URL = 'http://192.168.122.2:30000';

const OAUTH_API_CLIENT_ID = 1;
const OAUTH_API_CLIENT_SECRET = "D1yhS8szbFYcyCQnxGDQZ0TXQpBXrqnK2oNkt7AJ";
export const ENVIRONMENT = getConfiguration();

export const FETCH_DEFUALT_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

export function FETCH_HEADER_WITH_AUTH(accessToken = null) {
    return {
        ...FETCH_DEFUALT_HEADERS,
        "Authorization": `Bearer ${accessToken || userToken()['access_token']}`
    };
}

function getConfiguration() {
    return new Promise(async (resolve, reject) => {
        const response = await fetch('/config/constants.json');
        if (!response.ok)
            reject(new Error('Couldn\'t fetch the configuration'));
        resolve(await response.json());
    });
}

