import { CommentsElement } from './components/comments.js';
import './components/nav-bar.js';
import { TaskElement } from './components/task.js';
import { ENVIRONMENT, FETCH_DEFUALT_HEADERS } from "./modules/constants.js";

const URL_HASH = window.location.hash;
const TASK_ID = URL_HASH.substring(1);

if (!TASK_ID || isNaN(TASK_ID))
    document.location = '/';

ENVIRONMENT.then(environment => {
    const { TASK_API_URL } = environment;
    fetch(TASK_API_URL + `/task/${TASK_ID}`, {
        headers: FETCH_DEFUALT_HEADERS,
    })
    .then(res => res.ok ? res.json() : new Error())
    .then(task => {
        document.body.appendChild(new TaskElement(task))
        document.body.appendChild(new CommentsElement(TASK_ID, task.comments))
    })
    .catch(err => console.error(err))
})
