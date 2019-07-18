export class Request {

    async post(request, datos) {
        let propiedades = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }

        const nuevo = await fetch(request, propiedades);
        const resultado = await nuevo.json();

        return resultado;
    }

    async postFile(request, datos) {
        let propiedades = {
            method: 'POST',
            body: datos
        }

        const nuevo = await fetch(request, propiedades);
        const resultado = await nuevo.json();

        return resultado;
    }

    async get(request) {

        const datos = await fetch(request);
        const resultado = await datos.json();

        return resultado;
    }

    async getId(request, id) {

        let propiedades = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const datos = await fetch(`${request}/${id}`, propiedades);
        const resultado = await datos.json();

        return resultado;
    }

    async put(request, datos) {
        let propiedades = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }
        const actualizar = await fetch(request, propiedades);
        const resultado = await actualizar.json();

        return resultado;
    }

    async delete(request, id) {
        let propiedades = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const eliminar = await fetch(`${request}/${id}`, propiedades);
        const resultado = await eliminar.json();

        return resultado;
}

}