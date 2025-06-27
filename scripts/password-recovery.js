import './components/nav-bar.js';
import { passwordRecovery } from './modules/userMangement.js';

const HTML_ELEMENTS = Object.freeze({
    PASSWORD_RECOVERY_FORM: document.getElementById('passwordRecoveryForm')
});

HTML_ELEMENTS.PASSWORD_RECOVERY_FORM.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(
        new FormData(HTML_ELEMENTS.PASSWORD_RECOVERY_FORM)
    );
    try {
        passwordRecovery(data);
    } catch(error) {
        alert(error);
        HTML_ELEMENTS.PASSWORD_RECOVERY_FORM.reset();
    }
}
