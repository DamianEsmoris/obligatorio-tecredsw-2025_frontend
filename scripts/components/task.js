export class TaskElement extends HTMLElement {
    constructor(task) {
        super();
        task.startDate = new Date(task.start_date);
        task.dueDate = new Date(task.due_date)
        delete task.start_date;
        delete task.due_date;
        this.task = task;
    }

    connectedCallback() {
        const mainContainer = document.createElement('section');
        const article = document.createElement('article');
        mainContainer.className = 'container';

        const header = document.createElement('header');

        const title = document.createElement('h1');
        title.textContent = this.task.title;

        const categoriesCont = document.createElement('div');
        categoriesCont.innerHTML = this.task.categories.map(({name}) => `<span>${name}</span>`);

        const dateText = document.createElement('i');
        dateText.textContent =
            this.task.startDate.toLocaleString()
            +  ' - '
            + this.task.dueDate.toLocaleString();

        const completenessBar = document.createElement('progress');
        console.log(this.task.completeness);
        completenessBar.value = this.task.completeness;
        completenessBar.min = 0;
        completenessBar.max = 100;

        header.appendChild(title);
        header.appendChild(categoriesCont);
        header.appendChild(dateText);
        header.appendChild(completenessBar);

        const description = document.createElement('p');
        description.textContent = this.task.description;

        article.appendChild(header);
        article.appendChild(description);
        mainContainer.appendChild(article);
        this.appendChild(mainContainer);
    }
}


customElements.define('task-info', TaskElement) 
