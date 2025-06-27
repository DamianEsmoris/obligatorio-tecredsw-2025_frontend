import { userToken } from "./userMangement.js";

export const TASK_API_URL = 'http://localhost:8000/api';
export const OAUTH_API_URL = 'http://localhost:8001';

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

export function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
