import './components/nav-bar.js';
import { ENVIRONMENT, FETCH_HEADER_WITH_AUTH } from './modules/constants.js';

const HTML_ELEMENTS = Object.freeze({
    COMMENT_FORM: document.getElementById('editCommentForm')
});

if (!('comment' in localStorage))
    document.location = '/';

const comment = JSON.parse(localStorage.getItem('comment'));

HTML_ELEMENTS.COMMENT_FORM['body'].value = comment.body;

HTML_ELEMENTS.COMMENT_FORM.onsubmit = async (e) => {
    const { TASK_API_URL } = await ENVIRONMENT;
    e.preventDefault();
    let data = Object.fromEntries(
        new FormData(HTML_ELEMENTS.COMMENT_FORM)
    );
    data = { ...comment, ...data };
    localStorage.removeItem('comment');
    fetch(TASK_API_URL + '/comment/' + comment.id, {
        method: "PUT",
        headers: FETCH_HEADER_WITH_AUTH(),
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(() => document.location = '/task.html#' + data.task_id)
    .catch(error => {
        console.error(error);
        HTML_ELEMENTS.COMMENT_FORM.reset();
    });
}

