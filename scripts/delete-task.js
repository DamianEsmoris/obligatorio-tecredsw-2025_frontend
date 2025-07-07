import './components/nav-bar.js';
import { ENVIRONMENT, FETCH_HEADER_WITH_AUTH } from './modules/constants.js';
import { checkIfUnauthorized } from './modules/userMangement.js';

checkIfUnauthorized();

const URL_HASH = window.location.hash;
const TASK_ID = URL_HASH.substring(1);

if (!TASK_ID || isNaN(TASK_ID))
    document.location = '/';

ENVIRONMENT.then(async (environment) => {
    const TASK_API_URL = environment.TASK_API_URL;
    const request = await fetch(TASK_API_URL + '/task/' + TASK_ID, { headers: FETCH_HEADER_WITH_AUTH() });
    if (!request.ok)
        throw new Error ('Something went wrong deleting the task');
    const task = await request.json();
    const taskRequest = await fetch(TASK_API_URL + '/task/' + task.id, {
        method: "DELETE",
        headers: FETCH_HEADER_WITH_AUTH(),
    })
    if (!taskRequest.ok)
        console.error(error);
    else
        document.location = '/';
});
