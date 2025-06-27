import './components/nav-bar.js';
import { FETCH_DEFUALT_HEADERS, FETCH_HEADER_WITH_AUTH, TASK_API_URL } from "./modules/constants.js";
import { getUsers, userData } from './modules/userMangement.js';


const HTML_ELEMENTS = Object.freeze({
    TASK_CONTAINER: document.getElementById('taskContainer'),
    COMMENTS_CONTAINER: document.getElementById('commentsContainer'),
    COMMENT_FORM: document.getElementById('commentForm')
});

const USER_ID_MAPPING = new Map();
const URL_HASH = window.location.hash;
const TASK_ID = URL_HASH.substring(1);

if (!TASK_ID || isNaN(TASK_ID))
    document.location = '/';

function parseComments(comments) {
}

function getTaskDetails({id, title, author_id: _authorId, description, start_date: startDate, due_date: dueDate, categories = [], comments}) {
    return `
    <article>
    <header>
        <h1>${id}: ${title}</h1>
        <div>${categories.map(({name}) => `<span>${name}</span>`)}</div>
        <i>${new Date(startDate).toLocaleString()} - ${new Date(dueDate).toLocaleString()}</i>
    </header>
    <p>${description}</p>
    <footer>
        ${comments.reduce((acc, {author_id: authorId, body}) =>
        `${acc}<article>${USER_ID_MAPPING.get(authorId)['name']}: ${body}</article>`, '')}
    </footer>
    </article>
    `;
}


getUsers().then(users =>
    users.forEach(user => USER_ID_MAPPING.set(user.id+'', user))
)
.then(() =>
    fetch(TASK_API_URL + `/task/${TASK_ID}`, {
        headers: FETCH_DEFUALT_HEADERS,
    })
    .then(res => res.ok ? res.json() : new Error())
    .then(task =>  
        HTML_ELEMENTS.TASK_CONTAINER.innerHTML += getTaskDetails(task)
    )
    .catch(err => console.error(err))
)
.catch(error => alert(error));



HTML_ELEMENTS.COMMENT_FORM.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(HTML_ELEMENTS.COMMENT_FORM));
    data.task_id = TASK_ID;
    data.author_id = userData()['id'];
    fetch(TASK_API_URL + '/comment', {
        method: "POST",
        headers: FETCH_HEADER_WITH_AUTH(),
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(() => location.reload())
    .catch(error => {
        console.error(error);
        HTML_ELEMENTS.COMMENT_FORM.reset();
    });
}
