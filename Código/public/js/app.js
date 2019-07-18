//Se importan las clases que se necesitan
import { Admin } from './admins.js';
import { Eventos } from './eventos.js';
import { Users } from './users.js';

//Inicia componentes de libreria materializecss
M.AutoInit();

//Llamamos funciones dependiendo la ruta en la que se encuentre
let pagina = window.location.pathname;
if (pagina === '/view_admins') admins();
if (pagina === '/view_eventos') eventos_view();
if (pagina === '/new_eventos') eventos_new();
if (pagina === '/editar_eventos') eventos_edit();
if (pagina === '/registro') user_new();
if (pagina === '/login_user') user_login();
if (pagina === '/mi_perfil') user_perfil();
if (pagina === '/editar_user') user_editar_perfil();
if (pagina === '/') inicio();

//Funcion para el apartado de administradores que crea una instancia de la clase Admin para usar sus metodos
function admins() {
    let admin = new Admin();

    $('#password, #repetir-password, #usuario, #nombre').keyup(function() {
        admin.obtenerDatos();
    });

    $('#guardar').click(function() {
        if ($(this).hasClass('agregar')) admin.crearUsuario();
        else admin.actualizarUsuario();
    });

    $('#tablaAdmins tbody').on('click', 'a', function() {

        if ($(this).hasClass('editar')) {
            $('#nuevoUsuario').show().removeClass('oculto').addClass('visible');
            $('#btnNuevoUsuario i').text('close');

            $('#guardar').text('Actualizar').removeClass('agregar').addClass('actualizar');

            $('tr').removeClass('active');
            $(this).parents('tr').addClass('active');
            admin.limpiarUsuario();
            admin.colocarDatos($(this).parents('tr').prop("id"));


        } else if ($(this).hasClass('eliminar')) admin.eliminarUsuario($(this).parents('tr').prop("id"));
    });

    $('#btnNuevoUsuario').click(() => {
        if ($('#nuevoUsuario').hasClass('oculto')) {
            admin.limpiarUsuario();
            $('#nuevoUsuario').show().removeClass('oculto').addClass('visible');
            $('#btnNuevoUsuario i').text('close');

            $('#guardar').text('guardar').removeClass('actualizar').addClass('agregar');

        } else {
            $('#nuevoUsuario').hide().removeClass('visible').addClass('oculto');
            $('#btnNuevoUsuario i').text('add');
        }
    });

    $('#logout').click(function() {
        admin.CerrarSesion();
    });
    $('#logout2').click(function() {
        admin.CerrarSesion();
    });
}

//Funcion que crea una instancia de la clase Eventos y utiliza el metodo eliminarEvento y cargarEventos
function eventos_view() {
    let evento = new Eventos();
    $('body #principal').on('click', 'a', function() {
        if ($(this).hasClass('editar')) {
            location.href  = window.location.origin+"/editar_eventos"+"?id="+$(this).parents('div').parents('div').parents('div').parents('div').prop("id");
        } else if ($(this).hasClass('eliminar')) {
            evento.eliminarEvento($(this).parents('.card').prop("id"));
        }
    });

    $('body').on('click', '.card', function() {
        let id = $(this).prop("id");
        let lat = $(`#${id} span.lat`).text();
        let lng = $(`#${id} span.lng`).text();

        evento.mostrarUbicacion(lat, lng);
    });
}
//Funcion que crea una instancia de la clase Eventos y utiliza el metodo iniclizarMapa, obtenerDatos y crearEvento
function eventos_new() {
    let evento = new Eventos();
    evento.iniclizarMapa();

    $('#titulo, #lugar, #fecha, #precio, #descripcion').keyup(function() {
        evento.obtenerDatos();
    });
    
    $('#img').change(function() {
        evento.obtenerDatos();
    });

    $('#guardar').on('click', function(e) {
        e.preventDefault();
        evento.crearEvento();
    });

}

//Funcion que utiliza el metodo colocarDatos, obtenerDatos y actualizarEvento de la calase Evento
function eventos_edit() {
    var Id = window.location;
    Id = Id.toString().split("=").pop();
    new Eventos().colocarDatos(Id);
    
    $('#titulo, #lugar, #fecha, #precio, #descripcion').keyup(function() {
        new Eventos().obtenerDatos(Id);
    });

    $('#img').change(function() {
        new Eventos().obtenerDatos(Id);
    });

    $('#editar').click(function() {
        new Eventos().actualizarEvento(Id);
    });
}

//Funcion que crea una instancia de la clase Users y utiliza el metodo login
function user_login(){
    menu();
     let user = new Users();
    $('#btnLogin').click(function() {
        new Users().login();
    });
}
//Funcion que crea una instancia de la clase Users y utiliza el metodo obtenerDatos, crearUsuario y CerrarSesion
function user_new(){
    menu();
    let user = new Users();
    $('#nombre, #appaterno, #nombreUsuario, #email, #fechnac,#calle, #colonia, #numero ,#postal, #tel, #estatura, #peso, #tiposangre, #terminos').keyup(function() {
        new Users().obtenerDatos();
    });
    $('#terminos').change(function() {
        new Users().obtenerDatos();
    });
    $('#crear').click(function() {
        new Users().crearUsuario();
    });

    $('#cerrarsesion').click(function() {
        new Users().CerrarSesion();
    });
    $('#cerrarsesion2').click(function() {
        new Users().CerrarSesion();
    });
}

//Funcion que crea una instancia de la clase Users y utiliza el metodo verPerfil, eliminarUsuario y CerrarSesion
function user_perfil(){
    menu();
    let user = new Users();
    let evento = new Eventos(true);
    let id = JSON.parse(localStorage.getItem("user"));
    let sihay = evento.cargarEventosUser(id.data.id);
    new Users().verPerfil(id.data.id);
    let Id = id.data.id
    $('#eliminar').click(function() {
        new Users().eliminarUsuario(Id);
    });
    $('#cerrarsesion').click(function() {
        new Users().CerrarSesion();
    });
    $('#cerrarsesion2').click(function() {
        new Users().CerrarSesion();
    });
    $('body').on('click', '.card', function() {
        let id = $(this).prop("id");
        let lat = $(`#${id} span.lat`).text();
        let lng = $(`#${id} span.lng`).text();

        evento.mostrarUbicacion(lat, lng);
    });

     
}

//Funcion que crea una instancia de la clase Users y utiliza el metodo colocarDatos, obtenerDatos, actualizarUsuario y CerrarSesion
function user_editar_perfil(){
    menu();
    let user = new Users();
    let id = JSON.parse(localStorage.getItem("user"));
    new Users().colocarDatos(id.data.id);

    $('#nombre, #appaterno, #nombreUsuario, #email, #fechnac,#calle, #colonia, #numero ,#postal, #tel, #estatura, #peso, #tiposangre, #terminos').keyup(function() {
        new Users().obtenerDatos(id.data.id);
    });
    $('#terminos').change(function() {
        new Users().obtenerDatos(id.data.id);
    });
    $('#editar').click(function() {
        //new Users().obtenerDatos(id.data.id);
        new Users().actualizarUsuario(id.data.id);
    });

    $('#cerrarsesion').click(function() {
        new Users().CerrarSesion();
    });
    $('#cerrarsesion2').click(function() {
        new Users().CerrarSesion();
    });

}

function inicio(){
    menu();
    let evento = new Eventos(true);
    $('body #principal').on('click', 'a', function() {
        if ($(this).hasClass('asistir')) {
            
            if(localStorage.length!=0){
                let local = localStorage.getItem('user');
                local = JSON.parse(local);
                let idPersona = local.data.id;
                let idEvento = Number($(this).parents('.card').prop("id"));

                evento.asistirEvento(idPersona, idEvento, 'asistente');
            } else{
                evento.necesitarRegistrate();
            }
            //location.href  = window.location.origin+"/editar_eventos"+"?id="+$(this).parents('div').parents('div').parents('div').parents('div').prop("id");
        } else if ($(this).hasClass('participar')) {
            //evento.eliminarEvento($(this).parents('.card').prop("id"));
            if(localStorage.length!=0){
                let local = localStorage.getItem('user');
                local = JSON.parse(local);
                let idPersona = local.data.id;
                let idEvento = Number($(this).parents('.card').prop("id"));

                evento.asistirEvento(idPersona, idEvento, 'participante');
            } else {
                evento.necesitarRegistrate();
            }
        }
    });

        $('body').on('click', '.card', function() {
            let id = $(this).prop("id");
            let lat = $(`#${id} span.lat`).text();
            let lng = $(`#${id} span.lng`).text();
            evento.mostrarUbicacion(lat, lng);
        });

        $('#cerrarsesion').click(function() {
            new Users().CerrarSesion();
        });
        $('#cerrarsesion2').click(function() {
            new Users().CerrarSesion();
        });

}

function menu(){
    if((localStorage.token)!==undefined){
        localStorage.clear();
    }
    if(localStorage.length!=0){
        $('#menu').html("<li><a href=\"/\">Inicio</a></li><li><a href=\"/mi_perfil\">Mi perfil</a></li><li ><a id=\"cerrarsesion\" href=\"/\">Cerar sesión</a></li>");
        $('#mobile-demo').html("<li><a href=\"/\">Inicio</a></li><li><a href=\"/mi_perfil\">Mi perfil</a></li><li ><a id=\"cerrarsesion2\" href=\"/\">Cerar sesión</a></li>");
    } else{
        $('#menu').html("<li><a href=\"/\">Inicio</a></li><li><a href=\"/login_user\">Entrar</a></li><li><a href=\"/registro\">Registrarse</a></li>");
        $('#mobile-demo').html("<li><a href=\"/\">Inicio</a></li><li><a href=\"/login_user\">Entrar</a></li><li><a href=\"/registro\">Registrarse</a></li>");
    }
}

