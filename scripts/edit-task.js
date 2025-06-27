import './components/nav-bar.js';
import { TASK_API_URL, FETCH_HEADER_WITH_AUTH, FETCH_DEFUALT_HEADERS  } from "./modules/constants.js";
import { checkIfUnauthorized, getUsers, userData } from "./modules/userMangement.js";
import { formatDateTime, parseCSVline } from './modules/utils.js';
checkIfUnauthorized();

const HTML_ELEMENTS = Object.freeze({
    TASK_EDIT_FORM: document.getElementById('taskEditForm')
});

const USER_ID_MAPPING = {};
const URL_HASH = window.location.hash;
const TASK_ID = URL_HASH.substring(1);

if (!TASK_ID || isNaN(TASK_ID))
    document.location = '/';


const CATEGORIES_ID_MAPPING = new Map();
fetch(TASK_API_URL + '/category', {
    headers: FETCH_DEFUALT_HEADERS,
})
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(categories => categories.forEach(({id, name}) => CATEGORIES_ID_MAPPING.set(name, id)))
    .catch(error => alert(error));

const USER_EMAIL_MAPPING = new Map();
getUsers().then(users =>
    users.forEach(user => USER_EMAIL_MAPPING.set(user.email, user))
)
    .catch(error => alert(error));


async function createCategory(name) {
    const response = await fetch(TASK_API_URL + '/category', {
        method: "POST",
        headers: FETCH_HEADER_WITH_AUTH(),
        body: JSON.stringify({name})
    })
    const data = await response.json();
    CATEGORIES_ID_MAPPING.set(data.name, data.id); 
    return data;
}

async function replaceCategoriesWithIds(categories) {
    const newCategories = [];
    for (const i in categories) {
        const category = categories[i];
        if (!CATEGORIES_ID_MAPPING.has(category))
            newCategories.push([i, category])
        else
            categories[i] = CATEGORIES_ID_MAPPING.get(category);
    }
    console.log(newCategories);
    for (const [i, category] of newCategories) {
        const { id: categoryId } = await createCategory(category);
        categories[i] = categoryId;
    }
}


(async () => {
    await getUsers().then(users =>
        users.forEach(user => USER_ID_MAPPING[user.id] = user)
    );
    const taskRequest = await fetch(TASK_API_URL + '/task/' + TASK_ID, {
        headers: FETCH_HEADER_WITH_AUTH(),
    })
    if (!taskRequest.ok)
        throw new Error('Couldn\'t get the desired task');
    const task = await taskRequest.json();
    HTML_ELEMENTS.TASK_EDIT_FORM['title'].value = task.title;
    HTML_ELEMENTS.TASK_EDIT_FORM['description'].value = task.description;
    console.log(task.participants.map(({user_id}) => user_id));
    HTML_ELEMENTS.TASK_EDIT_FORM['completeness'].value = task.completeness;
    HTML_ELEMENTS.TASK_EDIT_FORM['participants'].value = task.participants.map(({user_id}) => USER_ID_MAPPING[user_id].email).join(",");
    HTML_ELEMENTS.TASK_EDIT_FORM['start_date'].value = task.start_date;
    HTML_ELEMENTS.TASK_EDIT_FORM['due_date'].value = task.due_date;
    HTML_ELEMENTS.TASK_EDIT_FORM['start_date'].value = task.start_date;
    HTML_ELEMENTS.TASK_EDIT_FORM['categories'].value = task.categories.map(({name}) => name.replaceAll(',', '\\,')).join(',');

    HTML_ELEMENTS.TASK_EDIT_FORM.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(HTML_ELEMENTS.TASK_EDIT_FORM));
        data.categories = parseCSVline(data.categories);
        data.participants = parseCSVline(data.participants);
        data.author_id = task.author_id;
        for (const i in data.participants) {
            const email = data.participants[i];
            if (!USER_EMAIL_MAPPING.has(email))
                throw new Error('undefined email');
            data.participants[i] = USER_EMAIL_MAPPING.get(email).id;
        }
        await replaceCategoriesWithIds(data.categories);
        if (data.start_date)
            data.start_date = formatDateTime(new Date(data.start_date));
        if (data.due_date)
            data.due_date = formatDateTime(new Date(data.due_date));
        data.author_id = data['author_id'];
        console.log(task);
        localStorage.removeItem('task');
        fetch(TASK_API_URL + '/task/' + task.id, {
            method: "PUT",
            headers: FETCH_HEADER_WITH_AUTH(),
            body: JSON.stringify(data)
        })
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(({id}) => document.location = '/task.html#' + id)
        .catch(error => {
            console.error(error);
            HTML_ELEMENTS.TASK_EDIT_FORM.reset();
        });
    }
})();
