import './components/nav-bar.js';
import { register } from './modules/userMangement.js';

const HTML_ELEMENTS = Object.freeze({
    REGISTER_FORM: document.getElementById('registerForm')
});

HTML_ELEMENTS.REGISTER_FORM.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(
        new FormData(HTML_ELEMENTS.REGISTER_FORM)
    );
    try {
        register(data);
    } catch(error) {
        alert(error);
        HTML_ELEMENTS.REGISTER_FORM.reset();
    }
}
