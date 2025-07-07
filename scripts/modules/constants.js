import { userToken } from "./userMangement.js";

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
        resolve(
            Object.freeze(await response.json())
        );
    });
}

