import { FETCH_DEFUALT_HEADERS, TASK_API_URL } from "../modules/constants.js";
import { userData, userSessionActive } from "../modules/userMangement.js";

async function getTasks(id) {
    id = id == null ? '' : '?participant_id=' + id;
    const response = await fetch(TASK_API_URL + '/task' + id, {
        headers: FETCH_DEFUALT_HEADERS,
    })
    if (!response.ok)
        throw new Error('Couldn\'t get the tasks!');
    return await response.json()
}

class TaskTable extends HTMLElement {

    tbody = null;
    userId = null;

    TABLE_HEADERS = [
        '#',
        'Título',
        'Desc.',
        'Incio',
        'Fin',
        'Categorias',
        'Acciones'
    ];

    JSON_KEYS = [
        ({id}) => `<a href='/task.html#${id}'>${id}</a>`,
        ({title}) => title,
        ({description}) => description,
        ({start_date : date}) => new Date(date).toLocaleString(),
        ({start_date : date}) => new Date(date).toLocaleString(),
        ({categories}) => categories.map(({name}) => `<span>${name.length > 12 ? name.slice(0,12) + '...' : name}</span>`),
        (task) => {
            return `
                <a href='/edit-task.html#${task.id}'>EDIT</a>
                <a href='/delete-task.html#${task.id}'>DELETE</a>
            `;
        }
    ]


    connectedCallback() {
        this.userId = this.getAttribute('assigned-to');

        const thead = document.createElement('thead');
        let tr = document.createElement('tr');
        for (const heading of this.TABLE_HEADERS) {
            const th = document.createElement('th');
            th.textContent = heading;
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        this.tbody = document.createElement('tbody');

        this.getData();
        this.appendChild(thead);
        this.appendChild(this.tbody);
    }

    async getData() {
        if (this.userId === 'myself') 
            this.userId = userData()['id'];
        const tasks = await getTasks(this.userId);
        for (const task of tasks)
            this.loadTasks(task);
    }

    loadTasks(task) {
        const tr = document.createElement('tr');
        const values = Object.values(this.JSON_KEYS);
        for (const callback of values) {
            const td = document.createElement('td');
            td.innerHTML = callback(task);
            tr.appendChild(td);
        }
        this.tbody.appendChild(tr);
    }
}

customElements.define('task-table', TaskTable);
