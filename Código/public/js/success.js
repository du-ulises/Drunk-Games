import { Request } from './request.js';
const request = new Request();

window.fbAsyncInit = function() {
    FB.init({
        appId            : 'your-app-id',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.2'
    });
};

(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v3.2';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

document.addEventListener('DOMContentLoaded', () => {
    let transaccion = document.querySelector('#transaccion').textContent;
    transaccion = transaccion.replace(':', '');

    let datos = {
        transaccion
    }

    // Verifica que el codigo de la transaccion exista en la BD
    request.post('/verificarExistencia', datos)
        .then(res => {
            if(res.ok) {
                // creamos el codigo qr
                let transaccion = res.transaccion;
                let contenedor = document.querySelector('#contenedor-qr');
                new QRCode(contenedor, transaccion);
            } else {
                let contenidoHTML = document.querySelector('.info-success');
                contenidoHTML.innerHTML = `
                    <h5 class="center white-text">Pagina invalida, sera redireccionado.</h5>
                `;

                setTimeout(() => {
                    location.href = window.location.origin;
                }, 2500);
            }
        });
});