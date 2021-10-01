
const url = "http://159.203.43.147:8000/api/products";
const contenedor = document.querySelector('tbody');

const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));

const formProducto = document.querySelector('form');

const codigo = document.getElementById('codigo');
const nombre = document.getElementById('nombre');
const precio = document.getElementById('precio');
const existencias = document.getElementById('existencias');

var result = '';
let opcion = '';
let idproducto = '';

//limpiar parametros
btnCrear.addEventListener('click', () => {
    codigo.value = '';
    nombre.value = '';
    precio.value = '';
    existencias.value = '';
    modalProducto.show();
    opcion = 'crear';
})

//funcionalidad mostrar productos
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => mostrar(result))
    .catch(error => console.log('error', error));

//listando productos en la tabla
const mostrar = (productos) => {
    productos.forEach(productos => {

        result += `<tr>
                    <td style="display:none;">${productos._id}</td>
                    <td>${productos.codigo}</td>
                    <td>${productos.nombre}</td>
                    <td class="text-center">${productos.precio}</td>
                    <td class="text-center">${productos.existencias}</td>
                    <td class="text-center"> <a class="btnEditar btn btn-primary">Editar</a></td>
                    <td class="text-center"> <a class="btnEliminar btn btn-danger">Eliminar</a></td>
                </tr>
                `
    });
    contenedor.innerHTML = result;
};



//funcionalidad accion boton
const action = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
};

//funcionalidad eliminar producto
action(document, 'click', '.btnEliminar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("Esta seguro que quiere eliminar el producto",
        function () {
            alertify.success('Ok');
            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };

            fetch(url + '/' + id, requestOptions)
                .then(response => response.json())
                .then(() => location.reload())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        },
        function () {
            alertify.error('Cancel');
        });
});


//mostrar datos de un producto segun su id
action(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.children[0].innerHTML;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(url + '/' + id, requestOptions)
        .then(response => response.json())
        .then(result => data(result))
        .catch(error => console.log('error', error));

    const data = (producto) => {
        idproducto = producto._id;
        codigo.value = producto.codigo;
        nombre.value = producto.nombre;
        precio.value = producto.precio;
        existencias.value = producto.existencias;
    };
    modalProducto.show();
    opcion = 'editar'
});


//Procedimiento para crear y editar
formProducto.addEventListener('submit', (e) => {
    e.preventDefault()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (opcion == 'crear') {

        var raw = JSON.stringify({
            "codigo": codigo.value,
            "nombre": nombre.value,
            "precio": precio.value,
            "existencias": existencias.value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
    }
    if (opcion == 'editar') {

        var raw = JSON.stringify({
            "id": idproducto,
            "codigo": codigo.value,
            "nombre": nombre.value,
            "precio": precio.value,
            "existencias": existencias.value
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw
        };
    }

    fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .then(() => location.reload())
            .catch(error => console.log('error', error));

    modalProducto.hide();
})