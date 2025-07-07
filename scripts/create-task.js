import './components/nav-bar.js';
import { FETCH_HEADER_WITH_AUTH, FETCH_DEFUALT_HEADERS, ENVIRONMENT  } from "./modules/constants.js";
import { checkIfUnauthorized, getUsers, userData } from "./modules/userMangement.js";
import { formatDateTime, parseCSVline } from './modules/utils.js';
checkIfUnauthorized();
let TASK_API_URL;

const USER_EMAIL_MAPPING = new Map();
const CATEGORIES_ID_MAPPING = new Map();

ENVIRONMENT.then(environment => {
    TASK_API_URL = environment.TASK_API_URL;

    fetch(TASK_API_URL + '/category', { headers: FETCH_DEFUALT_HEADERS })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(categories => categories.forEach(({id, name}) => CATEGORIES_ID_MAPPING.set(name, id)))
    .catch(error => alert(error));

    getUsers().then(users =>
        users.forEach(user => USER_EMAIL_MAPPING.set(user.email, user))
    )
    .catch(error => alert(error));

})

const HTML_ELEMENTS = Object.freeze({
    TASK_CREATION_FORM: document.getElementById('taskCreationForm')
});

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

HTML_ELEMENTS.TASK_CREATION_FORM.onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(HTML_ELEMENTS.TASK_CREATION_FORM));
    data.categories = parseCSVline(data.categories);
    data.participants = parseCSVline(data.participants);
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
    data.author_id = userData()['id'];
    fetch(TASK_API_URL + '/task', {
        method: "POST",
        headers: FETCH_HEADER_WITH_AUTH(),
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(({id}) => document.location = '/task.html#' + id)
    .catch(error => {
        console.error(error);
        HTML_ELEMENTS.TASK_CREATION_FORM.reset();
    });
}
