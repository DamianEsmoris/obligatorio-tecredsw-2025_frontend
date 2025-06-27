import { FETCH_DEFUALT_HEADERS, FETCH_HEADER_WITH_AUTH, OAUTH_API_CLIENT_ID, OAUTH_API_CLIENT_SECRET, OAUTH_API_URL } from "./constants.js";

export function checkIfUnauthorized() {
    if (!userSessionActive())
        document.location = '/';
}

export function userSessionActive() {
    return 'token' in localStorage;
}

export async function login(loginData) {
    loginData['grant_type'] =  "password";
    loginData['client_id'] = OAUTH_API_CLIENT_ID;
    loginData['client_secret'] = OAUTH_API_CLIENT_SECRET;
    const tokenResponse = await fetch(OAUTH_API_URL + '/oauth/token', {
        method: "POST",
        headers: FETCH_DEFUALT_HEADERS,
        body: JSON.stringify(loginData)
    })
    if (!tokenResponse.ok)
        throw new Error('Couldn\'t get the access_token');
    const token = await tokenResponse.json();
    const userDataResponse = await fetch(OAUTH_API_URL + '/api/validate', {
        headers: FETCH_HEADER_WITH_AUTH(token.access_token),
    })
    if (!userDataResponse.ok)
        throw new Error('Couldn\'t validate the access_token');
    const userData = await userDataResponse.json();
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('userData', JSON.stringify(userData))
    document.location = '/';
}

export function logout() {
    fetch(OAUTH_API_URL + '/api/logout', {
        headers: FETCH_HEADER_WITH_AUTH(),
    })
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    document.location = '/';
}

export function userToken() {
    return JSON.parse(localStorage.getItem('token'));
}

export function userData() {
    return JSON.parse(localStorage.getItem('userData'));
}

export async function getUsers() {
    const response = await fetch(OAUTH_API_URL + '/api/user', {
            headers: FETCH_DEFUALT_HEADERS,
    })
    if (!response.ok)
        throw new Error('Couldn\'t get the users data');
    return await response.json();
}
