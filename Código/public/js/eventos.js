// Modulos ******************************************************************************
import { Request } from './request.js';
import { Interfaz } from './interfaz.js';

const request = new Request();
const ui = new Interfaz();
let currentPosition;
let map;
let marker;

export class Eventos {
    constructor(inicio=false) {
        if(inicio){
            this.cargarEventosInicio();
        }else{
            this.cargarEventos();
        }
    }
    

    iniclizarMapa() {
        map = new google.maps.Map(document.getElementById('mapa'), {
            zoom: 13,
            center: {
                lat: 19.7034699,
                lng: -101.1847466
            }
        });

        google.maps.event.addListener(map, 'click', function (event) {
            currentPosition = event.latLng.toJSON();
            addMarker(currentPosition, map);
            $('#lat').val(currentPosition.lat);
            $('#lng').val(currentPosition.lng);
        });

        function addMarker(location, map) {
            if (marker != null) marker.setMap(null);

            marker = new google.maps.Marker({
                position: location,
                map: map
            });
        }
    }

    //Funcion encargada de mostrar los eventos ya registrados previamente
    cargarEventos() {
        request.get('/eventos')
            .then(res => {
                if (res.ok) {
                    let eventos = res.data;

                    eventos.forEach(evento => {
                        var fecha = evento.fecha.replace(/-/gi, "/").split("T");
                        let template = `
                                <div class="col s12 m6 l4">
                                    <div id=${evento.id} class="card">
                                        <div class="card-image waves-effect waves-block waves-light">
                                            <img class="activator" src="img/eventos/${evento.img}" style="height: 200px;">
                                        </div>

                                        <div class="card-content">
                                            <span class="card-title activator grey-text text-darken-4">${evento.titulo}<i class="material-icons right">more_vert</i></span>
                                            <p>${evento.descripcion}</p>
                                            <p class="font-weight-5">Lugar: <span>${evento.lugar}</span></p>
                                            <p class="font-weight-3">Fecha: <span>${fecha[0]}</span> </p>
                                        </div>

                                        <div class="card-reveal">
                                            <span class="card-title grey-text text-darken-4">${evento.titulo}<i class="material-icons right">close</i></span>
                                            
                                            <div class="row">
                                                <div class="col s12 margin-top-5">
                                                    <p class="font-weight-3">Fecha: <span>${fecha[0]}</span> </p>
                                                    <p class="font-weight-3">Precio: $<span>${evento.precio}</span></p>
                                                    <p class="font-weight-3">Asistentes: <span>${evento.numeroAsistentes}</span></p>
                                                    <p class="font-weight-3">Participantes: <span>${evento.numeroConcursantes}</span></p>
                                                    
                                                    <span class="lat">${evento.lat}</span>
                                                    <span class="lng">${evento.lng}</span>

                                                    <a href="#modal" class="waves-effect waves-light btn modal-trigger">
                                                        <i class="material-icons">place</i>
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col s12">
                                                    <a class="waves-effect waves-light btn blue editar">
                                                        <i class="material-icons">edit</i>
                                                    </a>
                                                    <a class="waves-effect waves-light btn red eliminar">
                                                        <i class="material-icons">delete</i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <!--Fin de descripcion del evento-->
                                    </div>
                                </div>`;
                        $('#principal').append(template);
                    });

                    this.iniclizarMapa();
                } else {
                    ui.mostrarAlert('Error al cargar los Eventos');
                }
            });
    }

    cargarEventosInicio() {
        request.get('/eventos')
            .then(res => {
                if (res.ok) {
                    let eventos = res.data;

                    eventos.forEach(evento => {
                        var fecha = evento.fecha.replace(/-/gi, "/").split("T");
                        let template = `
                                <div class="col s12 m6 l4">
                                    <div id=${evento.id} class="card">
                                        <div class="card-image waves-effect waves-block waves-light">
                                            <img class="activator" src="img/eventos/${evento.img}" style="height: 200px;">
                                        </div>

                                        <div class="card-content">
                                            <span class="card-title activator grey-text text-darken-4">${evento.titulo}<i class="material-icons right">more_vert</i></span>
                                            <p>${evento.descripcion}</p>
                                            <p class="font-weight-5">Lugar: <span>${evento.lugar}</span></p>
                                            <p class="font-weight-3">Fecha: <span>${fecha[0]}</span> </p>
                                        </div>

                                        <div class="card-reveal">
                                            <span class="card-title grey-text text-darken-4">${evento.titulo}<i class="material-icons right">close</i></span>
                                            
                                            <div class="row">
                                                <div class="col s12 margin-top-5">
                                                    <p class="font-weight-3">Fecha: <span>${fecha[0]}</span> </p>
                                                    <p class="font-weight-3">Precio: $<span>${evento.precio}</span></p>
                                                    <p class="font-weight-3 asistentes">Asistentes: <span>${evento.numeroAsistentes}</span></p>
                                                    <p class="font-weight-3 participantes">Participantes: <span>${evento.numeroConcursantes}</span></p>
                                                    
                                                    <span class="lat">${evento.lat}</span>
                                                    <span class="lng">${evento.lng}</span>

                                                    <a href="#modal" class="waves-effect waves-light btn modal-trigger">
                                                        <i class="material-icons">place</i>
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col s12">
                                                    <a class="waves-effect waves-light btn blue asistir">
                                                        <i class="material-icons">perm_contact_calendar</i>
                                                    </a>
                                                    <a class="waves-effect waves-light btn pink participar">
                                                        <i class="material-icons">pan_tool</i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <!--Fin de descripcion del evento-->
                                    </div>
                                </div>`;
                        $('#principal').append(template);
                    });

                    this.iniclizarMapa();
                } else {
                    ui.mostrarAlert('Error al cargar los Eventos');
                }
            });
    }


 cargarEventosUser(id) {
        var i = 1;
        request.getId('/eventosUser',id)
            .then(res => {
                if (res.ok) {
                    let eventos = res.data;
                    if(!(eventos.length > 0))
                        document.getElementById("eventos").innerHTML="<h4>Mis eventos</h4> <h6>No tienes eventos registrados para asistir o participar</h6>"
                    

                    eventos.forEach(evento => {
                        
                        var fecha = evento.fecha.replace(/-/gi, "/").split("T");
                        let template = `
                                <div class="col s12 m6 l4">
                                    <div id=${evento.fk_evento} class="card">
                                        <div class="card-image waves-effect waves-block waves-light">
                                            <img class="activator" src="img/eventos/${evento.img}" style="height: 200px;">
                                        </div>

                                        <div class="card-content">
                                            <span class="card-title activator grey-text text-darken-4">${evento.titulo}<i class="material-icons right">more_vert</i></span>
                                            <p>${evento.descripcion}</p>
                                            <p class="font-weight-5">Lugar: <span>${evento.lugar}</span></p>
                                            <p class="font-weight-3">Fecha: <span>${fecha[0]}</span> </p>
                                        </div>

                                        <div class="card-reveal">
                                            <span class="card-title grey-text text-darken-4">${evento.titulo}<i class="material-icons right">close</i></span>
                                            
                                            <div class="row">
                                                <div class="col s12 margin-top-5">
                                                    
                                                    <span class="lat">${evento.lat}</span>
                                                    <span class="lng">${evento.lng}</span>
                                                    <span class="codeqr">${evento.transaccion}</span>
                                                    <a href="#modal" class="waves-effect waves-light btn modal-trigger">
                                                        <i class="material-icons">place</i>
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col s12">
                                                    <a href="#modal${i}" class="waves-effect waves-light btn blue modal-trigger">
                                                        <i class="material-icons">list_alt</i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <!--Fin de descripcion del evento-->
                                    </div>
                                </div>
                                 `;
                        $('#eventos').append(template);
                        
                       // creamos el codigo qr
                        let transaccion = evento.transaccion;
                        let contenedor = document.getElementById("qr"+i);
                        new QRCode(contenedor, transaccion);
                        i++;
                    });

                    this.iniclizarMapa();
                } else {
                    ui.mostrarAlert('Error al cargar los Eventos');
                }
            });

    }

    //Funcion para mostrar ubicacion en el mapa
    mostrarUbicacion(lat, lng) {
        lat = Number(lat);
        lng = Number(lng);

        map = new google.maps.Map(document.getElementById('mapa'), {
            zoom: 17,
            center: {
                lat,
                lng
            }
        });

        if (marker != null) marker.setMap(null);

        marker = new google.maps.Marker({
            position: {
                lat,
                lng
            },
            map: map,
        });
    }

    //Funcion para obtener los datos del formulario para crear nuevo evento
    obtenerDatos(id) {
        let titulo = $('#titulo').val();
        let lugar = $('#lugar').val();
        let fecha = $('#fecha').val();
        let precio = $('#precio').val();
        let descripcion = $('#descripcion').val();
        let lat = $('#lat').val();
        let lng = $('#lng').val();
        let img = $('#img').val();

        // Se convierte la fecha al formato aceptado de mysql aaaa-mm-dd
        fecha = fecha.replace(",", " ").split(" ");

        switch (fecha[0]) {
            case "Jan":
                fecha[0] = 1;
                break;
            case "Feb":
                fecha[0] = 2;
                break;
            case "Mar":
                fecha[0] = 3;
                break;
            case "Apr":
                fecha[0] = 4;
                break;
            case "May":
                fecha[0] = 5;
                break;
            case "Jun":
                fecha[0] = 6;
                break;
            case "Jul":
                fecha[0] = 7;
                break;
            case "Aug":
                fecha[0] = 8;
                break;
            case "Sep":
                fecha[0] = 9;
                break;
            case "Oct":
                fecha[0] = 10;
                break;
            case "Nov":
                fecha[0] = 11;
                break;
            case "Dec":
                fecha[0] = 12;
        }
        fecha = fecha[3] + "-" + fecha[0] + "-" + fecha[1];
        // FIN de se convierte la fecha al formato aceptado de mysql aaaa-mm-dd
        if (id) {
            if (titulo !== '' && lugar !== '' && fecha !== '' && precio !== '' && descripcion !== '' && img !== '') {
                $('#editar').removeAttr("disabled");
                return {
                    titulo,
                    lugar,
                    fecha,
                    precio,
                    descripcion,
                    img,
                    lat,
                    lng,
                    id
                }
            } else {
                $('#editar').attr("disabled", true);
                return false;
            }
        }

        if (titulo !== '' && lugar !== '' && fecha !== '' && precio !== '' && descripcion !== '' && img !== '') {
            $('#guardar').removeAttr("disabled");
            return {
                titulo,
                lugar,
                fecha,
                precio,
                descripcion,
                img,
                lat,
                lng
            }
        } else {
            $('#guardar').attr("disabled", true);
            return false;
        }

    }

    //Funcion para crear un nuevo evento
    crearEvento() {
        let datos = this.obtenerDatos();

        if (datos !== false) {
            let formData = new FormData(document.getElementById('formulario'));
            formData.set('fecha',datos.fecha);
            request.postFile('/eventos', formData)
                .then(res => {
                    if (res.ok) {
                        M.toast({
                            html: 'Evento creado',
                            classes: 'rounded'
                        });
                        this.limpiarEvento();
                        setTimeout(() => {
                            location.href = window.location.origin + '/view_eventos';
                        }, 1000);
                    } else if (!res.token) {
                        location.href = window.location.origin;
                    } else {
                        ui.mostrarAlert('Error al crear evento', 'error');
                    }
                });
        }
    }


    // Funcion para eliminar un evento en especifico
    async eliminarEvento(id) {
        // Obtiene la respuesta del alert, devuelve 'true' en caso de que den aceptar
        let respuesta = await ui.mostrarAlert('Eliminar el Evento', 'warning');

        if (respuesta) {
            // Eliminamos el registro de la bd
            request.delete('/eventos', id)
                .then(res => {
                    if (res.ok === true) {
                        M.toast({
                            html: 'Evento eliminado',
                            classes: 'rounded'
                        });
                        $(`#${id}`).remove();
                    } else {
                        ui.mostrarAlert('Ocurrio un error al eliminar evento', 'error');
                    }
                });
        }
    }

    

    //Funcion que limpia los campos unas vez que se creo un nuevo evento
    limpiarEvento() {
        $('#titulo').val('');
        $('#lugar').val('');
        $('#fecha').val('');
        $('#precio').val('');
        $('#descripcion').val('');
        $('#img').val('');
        $('#guardar').attr("disabled", true);

        $('label').removeClass('active');
        $('input.validate').removeClass('valid');
        $('input.validate').removeClass('invalid');
        $('input').addClass('validate');
    }

    //Funcion para actualizar la informacion de un evento en especifico
    actualizarEvento(id) {

        let datos = this.obtenerDatos(id);

        request.put('/eventos', datos)
            .then(res => {
                if (res.ok) {
                    M.toast({
                        html: 'Evento actualizado',
                        classes: 'rounded'
                    });
                } else {
                    ui.mostrarAlert('Error al actualizar Administrador', 'error');
                }
            });
    }
  
    //Funcion para colocar los datos del evento en los campos correspondientes cuando se va a editar
    colocarDatos(id) {
        request.getId('/edit_eventos', id)
            .then(res => {
                if (res.ok) {
                    let evento = res.data;
                    var fecha = evento[0].fecha.replace(/-/gi, "/").split("T");
                    fecha = fecha[0].split("/");
                    switch (fecha[1]) {
                        case "1":
                            fecha[1] = "Jan";
                            break;
                        case "2":
                            fecha[1] = "Feb";
                            break;
                        case "3":
                            fecha[1] = "Mar";
                            break;
                        case "4":
                            fecha[1] = "Apr";
                            break;
                        case "5":
                            fecha[1] = "May";
                            break;
                        case "6":
                            fecha[1] = "Jun";
                            break;
                        case "7":
                            fecha[1] = "Jul";
                            break;
                        case "8":
                            fecha[1] = "Aug";
                            break;
                        case "9":
                            fecha[1] = "Sep";
                            break;
                        case "10":
                            fecha[1] = "Oct";
                            break;
                        case "11":
                            fecha[1] = "Nov";
                            break;
                        case "12":
                            fecha[1] = "Dec";
                    }
                    fecha = fecha[1] + " " + fecha[2] + ", " + fecha[0];
                    $('#titulo').val(evento[0].titulo);
                    $('#titulo').text(evento[0].titulo);
                    $('#lugar').val(evento[0].lugar);
                    $('#img').val(evento[0].img);
                    $('#precio').val(evento[0].precio);
                    $('#fecha').val(fecha);
                    $('#descripcion').val(evento[0].descripcion);
                    $('#lat').val(evento[0].lat);
                    $('#lng').val(evento[0].lng);
                } else {
                    ui.mostrarAlert('Error al cargar el evento para editar');
                }
            });
    }


    async necesitarRegistrate(){
        let respuesta = await ui.mostrarAlert('Es necesario tener una cuenta para poder asistir o participar en los eventos', 'info');
        if(respuesta){
            location.href = window.location.origin + '/registro'
        }
    }

    asistirEvento(idPersona, idEvento, tipoAsistencia) {
        let datos = {
            idPersona,
            idEvento,
            tipoAsistencia
        }
        
        request.post('/eventos/participar', datos)
            .then(res => {
                if(res.ok) location.href = res.url;
            });
    }

}