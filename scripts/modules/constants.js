import { userToken } from "./userMangement.js";

export const TASK_API_URL = 'apache.api-tareas-obligatorio-tecredsw.svc.cluster.local';
export const OAUTH_API_URL = 'apache.api-oauth-obligatorio-tecredsw.svc.cluster.local';

export const OAUTH_API_CLIENT_ID = 1;
export const OAUTH_API_CLIENT_SECRET = "D1yhS8szbFYcyCQnxGDQZ0TXQpBXrqnK2oNkt7AJ";

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
