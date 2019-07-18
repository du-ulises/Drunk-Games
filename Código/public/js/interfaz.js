export class Interfaz {
    async mostrarAlert(mensaje, tipo) {
        let respuesta;

        switch (tipo) {
            case 'success':
                swal({
                    title: 'Correcto',
                    text: mensaje,
                    type: 'success'
                });
                break;

            case 'error':
                swal({
                    title: 'Upps...',
                    text: mensaje,
                    type: 'error'
                });
                break;

            case 'warning':
                respuesta = await swal({
                    title: 'Estas seguro?',
                    text: mensaje,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, seguro!'
                }).then(result => true).catch(err => false);
                return respuesta;

            case 'info':
                respuesta = await swal({
                    title: 'Necesitas registrarte',
                    text: mensaje,
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Registrarme'
                }).then(result => true).catch(err => false);
                return respuesta;

            case 'question':
                respuesta = await swal({
                    title: 'Estas seguro?',
                    text: mensaje,
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, seguro!'
                }).then(result => true).catch(err => false);
                return respuesta;
        }
    }
}