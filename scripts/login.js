import './components/nav-bar.js';
import { login } from './modules/userMangement.js';

const HTML_ELEMENTS = Object.freeze({
    LOGIN_FORM: document.getElementById('loginForm')
});

HTML_ELEMENTS.LOGIN_FORM.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(
        new FormData(HTML_ELEMENTS.LOGIN_FORM)
    );
    try {
        login(data);
    } catch(error) {
        alert(error);
        HTML_ELEMENTS.LOGIN_FORM.reset();
    }
}
