// Modulos ******************************************************************************
import { Request } from './request.js';
import { Interfaz } from './interfaz.js';

const request = new Request();
const ui = new Interfaz();


export class Admin {
    constructor() {
        this.cargarUsuarios();
    }
    //Funcion para mostrar los administradores ya registrados
    cargarUsuarios() {
        request.get('/admins')
            .then(res => {
                if (res.ok) {
                    let usuarios = res.data;

                    usuarios.forEach(usuario => {
                        let tr = document.createElement('tr');
                        tr.id = usuario.id;

                        let template = `
                            <td>${usuario.usuario}</td>
                            <td>${usuario.nombre}</td>
                            <td class="center">
                                <a class="waves-effect waves-light btn blue mr-1 modal-trigger editar">
                                    <i class="material-icons">edit</i>
                                </a>
                                <a class="waves-effect waves-light btn red eliminar">
                                    <i class="material-icons">delete</i>
                                </a>
                            </td>
                        `;
                        $(tr).append(template);
                        $('#tablaAdmins tbody').append(tr);
                    });
                } else {
                    ui.mostrarAlert('Error al cargar los Administradores');
                }
            });
    }
    
    //Funcion para que los administradores puedan cerrar su sesión
    async CerrarSesion(){
        localStorage.clear();
        location.href = window.location.origin;
    }

    //Funcion para obtener los datos del formulario para crear nuevo administrador
    obtenerDatos() {
        let usuario = $('#usuario').val();
        let nombre = $('#nombre').val();
        let pass = $('#password').val();
        let repeatPassword = $('#repetir-password').val();

        let matchPassword;
        if (pass === repeatPassword && pass !== '' && repeatPassword !== '') {
            matchPassword = true;

            $('#repetir-password').removeClass('invalid');
            $('#repetir-password').addClass('validate');
            $('#repetir-password').addClass('valid');
        } else {
            matchPassword = false;

            if (repeatPassword !== '') {
                $('#repetir-password').removeClass('valid');
                $('#repetir-password').removeClass('validate');
                $('#repetir-password').addClass('invalid');

            }
        }

        if (usuario !== '' && nombre !== '' && matchPassword) {
            $('#guardar').removeAttr("disabled");
            return {
                usuario,
                nombre,
                pass
            }
        } else {
            $('#guardar').attr("disabled", true);
            return false;
        }
    }

    //Funcion encargada para crear un nuevo administrador
    async crearUsuario() {
        let datos = this.obtenerDatos();

        if(datos !== false) {
            request.post('/admins', datos)
                .then(res => {
                    if (res.ok) {
                        let tr = document.createElement('tr');
                        tr.id = res.id;
    
                        let template = `
                                <td>${datos.usuario}</td>
                                <td>${datos.nombre}</td>
                                <td class="center">
                                    <a class="waves-effect waves-light btn blue mr-1 modal-trigger editar">
                                        <i class="material-icons">edit</i>
                                    </a>
                                    <a class="waves-effect waves-light btn red eliminar">
                                        <i class="material-icons">delete</i>
                                    </a>
                                </td>
                            `;
                        $(tr).append(template);
                        $('#tablaAdmins tbody').append(tr);
    
                        M.toast({html: 'Administrador creado', classes: 'rounded'});
                        
                        $('#nuevoUsuario').hide().removeClass('visible').addClass('oculto');
                        $('#btnNuevoUsuario i').text('add');
                        this.limpiarUsuario();
                    } else if (!res.token) {
                        location.href = window.location.origin;
                    } else {
                        ui.mostrarAlert('Error al crear Administrador', 'error');
                    }
                });
        }

    }

    //Funcion encargada de eliminar un administrador
    async eliminarUsuario(id) {
        // Obtiene la respuesta del alert, devuelve 'true' en caso de que den aceptar
        let respuesta = await ui.mostrarAlert('Eliminar el Administrador', 'warning');

        if (respuesta) {
            // Eliminamos el registro de la bd
            request.delete('/admins', id)
                .then(res => {
                    if (res.ok) {
                        $(`#tablaAdmins tbody tr#${id}`).remove();
                        M.toast({html: 'Administrador eliminado', classes: 'rounded'});
                    } else {
                        console.log(res.err);
                        ui.mostrarAlert('Ocurrio un error', 'error');
                    }
                });
        }
    }

    //Funcion que limpia los campos unas vez que se creo un nuevo administrador
    limpiarUsuario() {
        $('#usuario').val('');
        $('#nombre').val('');
        $('#password').val('');
        $('#repetir-password').val('');

        $('label').removeClass('active');
        $('input.validate').removeClass('valid');
        $('input.validate').removeClass('invalid');
        $('input').addClass('validate');
    }

    //Funcion para colocar los datos del administrador en los campos correspondientes cuando se va a editar
    colocarDatos(id) {
        let tr = $(`#tablaAdmins tbody tr#${id}`);

        let datos = "";
        $(tr).find("td").each(function(index) {
            if (index < 3) {
                datos += $(this).html().trim();
                if (index < 2) datos += '*-';
            }
        });
        datos = datos.split('*-');

        $('#usuario').val(datos[0]);
        $('#nombre').val(datos[1]);

        $('label').addClass('active');
    }

    //Funcion encargada de actualizar a un administrador
    actualizarUsuario() {
        let datos = this.obtenerDatos();
        let tr = $('#tablaAdmins tbody tr.active');
        datos.id = tr.prop("id");

        request.put('/admins', datos)
            .then(res => {
                if (res.ok) {
                    tr.text('');
                    let template = `
                            <td>${datos.usuario}</td>
                            <td>${datos.nombre}</td>
                            <td class="center">
                                <a class="waves-effect waves-light btn blue mr-1 modal-trigger editar">
                                    <i class="material-icons">edit</i>
                                </a>
                                <a class="waves-effect waves-light btn red eliminar">
                                    <i class="material-icons">delete</i>
                                </a>
                            </td>
                        `;
                    $(tr).append(template);

                    M.toast({html: 'Administrador actualizado', classes: 'rounded'});

                    $('#nuevoUsuario').hide().removeClass('visible').addClass('oculto');
                    $('#btnNuevoUsuario i').text('add');
                    this.limpiarUsuario();
                } else {
                    console.log(res.err);
                    ui.mostrarAlert('Error al actualizar Administrador', 'error');
                }
            });
    }

}