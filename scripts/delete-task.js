import './components/nav-bar.js';
import { FETCH_HEADER_WITH_AUTH, TASK_API_URL } from './modules/constants.js';
import { checkIfUnauthorized } from './modules/userMangement.js';

checkIfUnauthorized();

const URL_HASH = window.location.hash;
const TASK_ID = URL_HASH.substring(1);

if (!TASK_ID || isNaN(TASK_ID))
    document.location = '/';

fetch(TASK_API_URL + '/task/' + TASK_ID, {
        headers: FETCH_HEADER_WITH_AUTH(),
})
.then(request => request.ok ? request.json() : Promise.reject('Something went wrong deleting the task'))
.then(task =>
    fetch(TASK_API_URL + '/task/' + task.id, {
        method: "DELETE",
        headers: FETCH_HEADER_WITH_AUTH(),
    })
    .then(() => document.location = '/')
    .catch(error => {
        console.error(error);
    })
);

