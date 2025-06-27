import { logout, userData, userSessionActive } from "../modules/userMangement.js";

function wrapInLi(elem) {
    const li = document.createElement('li');
    li.appendChild(elem);
    return li;
}

class NavBar extends HTMLElement {
    connectedCallback() {
        this.className = 'container';

        const leftItems = document.createElement('ul');
        const middleItems = document.createElement('ul');
        const rightItems = document.createElement('ul');

        const indexLink = document.createElement('a');
        indexLink.href = '/';
        indexLink.textContent = 'Inicio';
        leftItems.appendChild(wrapInLi(indexLink));
        if (userSessionActive()) {
            const usernameText = document.createElement('span');
            usernameText.textContent = userData()['email'];

            const createTaskLink = document.createElement('a');
            createTaskLink.href = '/create-task.html';
            createTaskLink.textContent = 'Nueva tarea';

            const logoutBttn = document.createElement('button');
            logoutBttn.textContent = 'Cerrrar sesión';
            logoutBttn.onclick = logout;

            middleItems.appendChild(wrapInLi(usernameText));
            rightItems.appendChild(wrapInLi(createTaskLink));
            rightItems.appendChild(wrapInLi(logoutBttn));
        } else {
            const loginLink = document.createElement('a');
            loginLink.textContent = 'Iniciar sesión';
            loginLink.href = '/login.html';
            rightItems.appendChild(wrapInLi(loginLink));
        }
        this.appendChild(leftItems);
        this.appendChild(middleItems);
        this.appendChild(rightItems);
    }
}

customElements.define('nav-bar', NavBar);
