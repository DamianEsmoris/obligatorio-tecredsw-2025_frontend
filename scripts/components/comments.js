import { FETCH_HEADER_WITH_AUTH, TASK_API_URL } from "../modules/constants.js";
import { getUsers, userData, userSessionActive } from "../modules/userMangement.js";

const USER_ID_MAPPING = {};
let commentContainer;


function createOwnComment(comment) {
    const text = document.createElement('p');
    text.textContent = USER_ID_MAPPING[comment['author_id']]['name'] + ": " + comment.body;
    text.oncontextmenu = (e) => {
        e.preventDefault();
        localStorage.setItem('comment', JSON.stringify(comment));
        document.location = '/edit-comment.html';
    }
    return text;
}

export class CommentsElement extends HTMLElement {
    comments;
    taskId;

    constructor(taskId, comments) {
        super();
        this.comments = comments;
        this.taskId = taskId;
    }

    connectedCallback() {
        const mainContainer = document.createElement('section');
        const middleCont = document.createElement('article');
        const container = document.createElement('header');
        commentContainer = container;
        const footer = document.createElement('footer');
        mainContainer.className = 'container';

        let userId = userSessionActive() ? userData()['id'] : null;
        getUsers().then(users =>
            users.forEach(user => USER_ID_MAPPING[user.id] = user)
        ).then(() =>
            this.comments.forEach(comment => {
                const text = comment['author_id'] == userId ? createOwnComment(comment) : document.createElement('p');
                text.textContent = USER_ID_MAPPING[comment['author_id']]['name']  + ": " + comment.body;
                container.appendChild(text);
            })
        );
        middleCont.appendChild(container);
        mainContainer.appendChild(middleCont);

        if (userSessionActive()) {
            const commentForm = document.createElement('form');

            const commentBody = document.createElement('input');
            commentBody.type = 'text';
            commentBody.name = 'body';

            const commentSubmit = document.createElement('input');
            commentSubmit.type = 'submit';

            commentForm.appendChild(commentBody);
            commentForm.appendChild(commentSubmit);

            commentForm.onsubmit = (event) => postComment(event, this.taskId);
            footer.appendChild(commentForm);
            middleCont.appendChild(footer);
        }

        this.appendChild(mainContainer);
    }
}


function postComment(event, taskId) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    data.task_id = taskId;
    data.author_id = userData()['id'];
    fetch(TASK_API_URL + '/comment', {
        method: "POST",
        headers: FETCH_HEADER_WITH_AUTH(),
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then((comment) => {
        const commentElement =  createOwnComment(comment);
        commentElement.textContent = userData()['name'] + ": " + data.body;
        commentContainer.appendChild(commentElement);
        event.target.reset();
    })
    .catch(error => {
        console.error(error);
        commentContainer.lastChild.remove();
        event.target.reset();
    });
}

customElements.define('task-comments', CommentsElement) 
