import { Request } from './request.js';
import { Interfaz } from './interfaz.js';

M.AutoInit();
const request = new Request();
const ui = new Interfaz();

const login = () => {
    let datos = {
        usuario: document.querySelector('#usuario').value,
        password: document.querySelector('#password').value
    }

    if (datos.usuario === '' || datos.password === '') 
        ui.mostrarAlert('Ingrese usuario y contraseña', 'error');
    else {
        request.post('/login_admins', datos)
            .then(res => {
                if (res.ok) {
                    localStorage.setItem('token', res.token);
                    location.href = `${window.location.origin}/view_eventos`
                } else {
                    ui.mostrarAlert(res.err, 'error');
                }
            });
    }
}

document.querySelector('#btnLogin').addEventListener('click', login);