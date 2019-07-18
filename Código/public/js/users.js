// Modulos ******************************************************************************
import { Request } from './request.js';
import { Interfaz } from './interfaz.js';

const request = new Request();
const ui = new Interfaz();

export class Users {

    //En el constructor verificamos si algun usaio ya inicio sesion o no, y colocamos el menu correspondiente
    constructor(){
    }

    //Funcion para que los usuarios puedan iniciar sesión
   login() {
        let datos = {
            usuario:  $('#usuario').val(),
            password: $('#password').val()
        }
    
        if (datos.usuario === '' || datos.password === '') 
            ui.mostrarAlert('Ingrese usuario y contraseña', 'error');
        else {
            request.post('/login_users', datos)
                .then(res => {
                    if (res.ok) {
                        $('#menu').html("<li><a href=\"/\">Inicio</a></li><li><a href=\"/mi_perfil\">Mi perfil</a></li>");
                        localStorage.setItem('user', JSON.stringify(res));

                        location.href = `${window.location.origin}`
                    } else {
                        ui.mostrarAlert(res.err, 'error');
                    }
                });
        }
    }

    //Funcion para obtener los datos del formulario para crear nuevo usuario
    obtenerDatos(id) {
        
        let nombre = $('#nombre').val();
        let paterno = $('#appaterno').val();
        let materno = $('#apmaterno').val();
        let usuario = $('#nombreUsuario').val(); 
        let email = $('#email').val();
        let fechaNac = $('#fechnac').val();
        let pass = $('#pass').val();
        let rpass = $('#rpass').val();
        let calle = $('#calle').val();
        let colonia = $('#colonia').val();
        let numero = $('#numero').val();
        let codigoPostal = $('#postal').val();
        let telefono = $('#tel').val();
        let estatura = $('#estatura').val();
        let peso = $('#peso').val();
        let tipoSangre = $('#tiposangre').val();
        let aceptoTerminos = $('#terminos').prop('checked');
        let matchPassword;
        
        var f = new Date();
        fechaNac  = fechaNac.replace(","," ").split(" ");

        switch(fechaNac[0]){
            case "Jan": fechaNac[0] = 1;
                        break;
            case "Feb": fechaNac[0] = 2;
                        break;
            case "Mar": fechaNac[0] = 3;
                        break;
            case "Apr": fechaNac[0] = 4;
                        break;
            case "May": fechaNac[0] = 5;
                        break;
            case "Jun": fechaNac[0] = 6;
                        break;
            case "Jul": fechaNac[0] = 7;
                        break;
            case "Aug": fechaNac[0] = 8;
                        break;
            case "Sep": fechaNac[0] = 9;
                        break;
            case "Oct": fechaNac[0] = 10;
                        break;
            case "Nov": fechaNac[0] = 11;
                        break;
            case "Dec": fechaNac[0] = 12;
        }
        if(fechaNac[0] !== "" ){

            if( (parseInt(f.getFullYear())-(parseInt(fechaNac[3]))) >= 18 ){ 
                if((parseInt(f.getFullYear())-(parseInt(fechaNac[3])))==18){
                    if( ((parseInt(f.getMonth()+1)-parseInt(fechaNac[0]))) >= 0 ){
                        if( ((parseInt(f.getMonth()+1)-parseInt(fechaNac[0])))==0){
                            if( ((parseInt(f.getDate())-parseInt(fechaNac[1]))) >= 0 ){
                                fechaNac = fechaNac[3]+"-"+fechaNac[0]+"-"+fechaNac[1];
                            }else {
                                ui.mostrarAlert('Tienes que ser mayor de edad para poder registrarte', 'error');
                                return;
                            }
                        }
                    }else {
                        fechaNac = fechaNac[3]+"-"+fechaNac[0]+"-"+fechaNac[1];
                    }
                } else {
                        fechaNac = fechaNac[3]+"-"+fechaNac[0]+"-"+fechaNac[1];
                }
            } else {
                ui.mostrarAlert('Tienes que ser mayor de edad para poder registrarte', 'error');
                return;
            }

        }

        if (pass !== '' && rpass !== '') {
            if(pass === rpass)
                matchPassword = true;
                else{
                    matchPassword = false;
                    ui.mostrarAlert('Las contraseñas no coinciden', 'error');
                    return;
                }       
        }

        if(id){
            if (nombre !== '' && paterno !== ''  
                && materno !== '' && usuario !== '' && email !== ''
                && calle !== '' && colonia !== '' && numero !== '' && codigoPostal !== ''
                && telefono !== '' && estatura !== '' && peso !== '' && tipoSangre !== ''
                && aceptoTerminos && matchPassword) {
                $('#editar').removeAttr("disabled");
                return {
                    nombre,
                    paterno,
                    materno,
                    usuario,
                    email,
                    fechaNac,
                    pass,
                    calle,
                    colonia,
                    numero,
                    codigoPostal,
                    telefono,
                    estatura,
                    peso,
                    tipoSangre,
                    aceptoTerminos,
                    id
                }
            } else {
                $('#editar').attr("disabled", true);
                return false;
            }
        }
        
        if (nombre !== '' && paterno !== '' 
        && materno !== '' && usuario !== '' && email !== ''
        && calle !== '' && colonia !== '' && numero !== '' && codigoPostal !== ''
        && telefono !== '' && estatura !== '' && peso !== '' && tipoSangre !== ''
        && aceptoTerminos && matchPassword) {
            $('#crear').removeAttr("disabled");
            return {
                usuario,
                nombre,
                paterno,
                materno,
                email,
                telefono,
                pass,
                calle,
                colonia,
                numero,
                codigoPostal,
                fechaNac,
                estatura,
                peso,
                tipoSangre,
                aceptoTerminos,
            }
        } else {
            $('#crear').attr("disabled", true);
            return false;
        }

    }

    //Funcion para crear un nuevo usuario
    async crearUsuario() {
        let datos = this.obtenerDatos();

        if(datos !== false) {
            request.post('/users', datos)
                .then(res => {
                    if (res.ok) {
                        M.toast({html: 'Usuario creado', classes: 'rounded'});
                        this.limpiarUsuario();
                    } else if (!res.token) {
                        //location.href = window.location.origin;
                    } else {
                        ui.mostrarAlert('Error al crear Usuario', 'error');
                    }
                });
        }

    }

    //Funcion para que los usuario puedan cerrar su sesión
    async CerrarSesion(){
        localStorage.clear();
        location.href = window.location.origin;
    }

    //Funcion para dar de baja una cuenta de un usuario en especifico
    async eliminarUsuario(id) {
        // Obtiene la respuesta del alert, devuelve 'true' en caso de que den aceptar
        let respuesta = await ui.mostrarAlert('Eliminar tu cuenta', 'warning');

        if (respuesta) {
            // Eliminamos el registro de la bd
            request.delete('/users', id)
                .then(res => {
                    if (res.ok === true) {
                        M.toast({html: 'Tu cuenta a sido eliminada', classes: 'rounded'});
                        localStorage.clear();
                        location.href = window.location.origin;
                    } else {
                        ui.mostrarAlert('Ocurrio un error al eliminar tu cuenta', 'error');
                    }
                });
        }
    }
    //Funcion que limpia los campos unas vez que se creo un nuevo usuario
    limpiarUsuario() {
        $('#nombre').val('');
        $('#appaterno').val('');
        $('#apmaterno').val('');
        $('#nombreUsuario').val(''); 
        $('#email').val('');
        $('#fechnac').val('');
        $('#pass').val('');
        $('#rpass').val('');
        $('#calle').val('');
        $('#colonia').val('');
        $('#numero').val('');
        $('#postal').val('');
        $('#tel').val('');
        $('#estatura').val('');
        $('#peso').val('');
        $('#tiposangre').val('');
        $('#terminos').val('');
        $('#crear').attr("disabled", true);

        $('label').removeClass('active');
        $('input.validate').removeClass('valid');
        $('input.validate').removeClass('invalid');
        $('input').addClass('validate');
    }

    //Funcion que permite actualizar la informacion de perfil del usuario
    actualizarUsuario(id) {

        let datos = this.obtenerDatos(id);
        //datos["fachaNac"] = JSON.stringify(datos["fechaNac"][3])+"-"+JSON.stringify(datos["fechaNac"][1]+"-"+JSON.stringify(datos["fechaNac"][0]));
        console.log("AquiaCTUALIZAR:"+JSON.stringify(datos["fechaNac"]));

        request.put('/users', datos)
            .then(res => {
                if (res.ok) {
                    M.toast({html: 'Usuario actualizado', classes: 'rounded'});
                } else {
                    ui.mostrarAlert('Error al actualizar usuario', 'error');
                }
            });
    }

    //Funcion que permite a los usuario ver su informacion de perfil   
    verPerfil(id) {
        request.getId('/perfil_datos',id)
            .then(res => {
                if (res.ok) {
                    let user = res.data;
                    var fecha = user[0].fechaNac.replace(/-/gi,"/").split("T");
                        fecha = fecha[0].split("/");
                    switch(fecha[1]){
                        case "1": fecha[1] = "Jan" ;
                                break;
                        case "2": fecha[1] = "Feb" ;
                                break;
                        case "3": fecha[1] = "Mar" ;
                                break;
                        case "4": fecha[1] = "Apr" ;
                                break;
                        case "5": fecha[1] = "May" ;
                                break;
                        case "6": fecha[1] = "Jun" ;
                                break;
                        case "7": fecha[1] = "Jul" ;
                                break;
                        case "8": fecha[1] = "Aug" ;
                                break;
                        case "9": fecha[1] = "Sep" ;
                                break;
                        case "10": fecha[1] = "Oct" ;
                                break;
                        case "11": fecha[1] = "Nov" ;
                                break;
                        case "12": fecha[1] = "Dec" ;
                    }
                    fecha = fecha[1]+" "+fecha[2]+", "+fecha[0];
                    $('#nombre').text(user[0].nombre+" "+user[0].paterno+" "+user[0].materno);
                    $('#usuario').text(user[0].usuario);
                    $('#tipoSangre').text(user[0].tipoSangre);
                    $('#peso').text(user[0].peso);
                    $('#estatura').text(user[0].estatura);
                    $('#nombrereveal').html(user[0].nombre+" "+user[0].paterno+" "+user[0].materno+"<i class=\"material-icons right\">close</i>");
                    $('#usuarioreveal').html("<i class=\"material-icons cyan-text text-darken-2\">perm_identity</i>"+user[0].usuario);
                    $('#tel').html("<i class=\"material-icons cyan-text text-darken-2\">perm_phone_msg</i>"+" "+user[0].telefono);
                    $('#email').html("<i class=\"material-icons cyan-text text-darken-2\">email</i>"+user[0].email);
                    $('#cumple').html("<i class=\"material-icons cyan-text text-darken-2\">cake</i>"+fecha);
                    $('#direccion').text("Calle:"+user[0].calle+" "+"Col:"+user[0].colonia+" #"+user[0].numero+"\n\n"+"Codigo postal: "+user[0].codigoPostal);
                }else {
                    ui.mostrarAlert('Error al cargar el usuario');
                }
            });
    }

    //Funcion para colocar los datos del usuario en los campos correspondientes cuando se va a editar
    colocarDatos(id) {
        request.getId('/perfil_datos',id)
            .then(res => {
                if (res.ok) {
                    let user = res.data;
                    var fecha = user[0].fechaNac.replace(/-/gi,"/").split("T");
                        fecha = fecha[0].split("/");
                    switch(fecha[1]){
                        case "1": fecha[1] = "Jan" ;
                                break;
                        case "2": fecha[1] = "Feb" ;
                                break;
                        case "3": fecha[1] = "Mar" ;
                                break;
                        case "4": fecha[1] = "Apr" ;
                                break;
                        case "5": fecha[1] = "May" ;
                                break;
                        case "6": fecha[1] = "Jun" ;
                                break;
                        case "7": fecha[1] = "Jul" ;
                                break;
                        case "8": fecha[1] = "Aug" ;
                                break;
                        case "9": fecha[1] = "Sep" ;
                                break;
                        case "10": fecha[1] = "Oct" ;
                                break;
                        case "11": fecha[1] = "Nov" ;
                                break;
                        case "12": fecha[1] = "Dec" ;
                    }
                    fecha = fecha[1]+" "+fecha[2]+", "+fecha[0];
                    $('#nombre').val(user[0].nombre);
                    $('#appaterno').val(user[0].paterno);
                    $('#apmaterno').val(user[0].materno);
                    $('#nombreUsuario').val(user[0].usuario);
                    $('#email').val(user[0].email);
                    $('#fechnac').val(fecha);
                    $('#tipoSangre').val(user[0].tipoSangre);
                    $('#calle').val(user[0].calle);
                    $('#colonia').val(user[0].colonia);
                    $('#numero').val(user[0].numero);
                    $('#postal').val(user[0].codigoPostal);
                    $('#tel').val(user[0].telefono);
                    $('#estatura').val(user[0].estatura);
                    $('#peso').val(user[0].peso);
                    $('#tiposangre').val(user[0].tipoSangre);
                }else {
                    ui.mostrarAlert('Error al cargar el usuario');
                }
            });
    }

}