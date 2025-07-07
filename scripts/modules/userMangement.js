import { ENVIRONMENT } from "./constants.js";


export function checkIfUnauthorized() {
    if (!userSessionActive())
        document.location = '/';
}

export function userSessionActive() {
    return 'token' in localStorage;
}

export async function passwordRecovery(passwordRecoveryData) {
    const { OAUTH_API_URL } = ENVIRONMENT;
    const registerResponse = await fetch(OAUTH_API_URL + '/api/user/password-recovery', {
        method: "POST",
        headers: FETCH_DEFUALT_HEADERS,
        body: JSON.stringify(passwordRecoveryData)
    })
    if (!registerResponse.ok)
        throw new Error('Couldn\'t recover the password');
    document.location = '/login.html';
}

export async function register(registerData) {
    const { OAUTH_API_URL, OAUTH_API_CLIENT_ID, OAUTH_API_CLIENT_SECRET } = ENVIRONMENT;
    const registerResponse = await fetch(OAUTH_API_URL + '/api/user', {
        method: "POST",
        headers: FETCH_DEFUALT_HEADERS,
        body: JSON.stringify(registerData)
    })
    if (!registerResponse.ok)
        throw new Error('Couldn\'t validate the access_token');
    const loginData = {
        'grant_type':  "password",
        'client_id': OAUTH_API_CLIENT_ID,
        'client_secret': OAUTH_API_CLIENT_SECRET,
        'username': registerData.email,
        'password': registerData.password
    }
    const tokenResponse = await fetch(OAUTH_API_URL + '/oauth/token', {
        method: "POST",
        headers: FETCH_DEFUALT_HEADERS,
        body: JSON.stringify(loginData)
    })
    if (!tokenResponse.ok)
        throw new Error('Couldn\'t get the access_token');
    const token = await tokenResponse.json();
    const userData = await registerResponse.json();
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('userData', JSON.stringify(userData))
    document.location = '/';
}

export async function login(loginData) {
    const { OAUTH_API_URL, OAUTH_API_CLIENT_ID, OAUTH_API_CLIENT_SECRET } = ENVIRONMENT;
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
    const { OAUTH_API_URL } = ENVIRONMENT;
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
    const { OAUTH_API_URL } = ENVIRONMENT;
    const response = await fetch(OAUTH_API_URL + '/api/user', {
            headers: FETCH_DEFUALT_HEADERS,
    })
    if (!response.ok)
        throw new Error('Couldn\'t get the users data');
    return await response.json();
}
