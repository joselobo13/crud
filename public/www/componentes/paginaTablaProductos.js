Vue.component('pagina-productos',{
    data: function () {
        return {
            listaProductos: [], // lista de los productos de la BBDD
            listaProductosCopia: [], // lista de los productos de la BBDD COPIA
            listaProductosPagina: [], // lista modificada de la BBDD
            listaProductosPaginaFinal: [], // lista modificada de la BBDD FINAL
            listaProductosPaginaActual: 1, // pagana actual de la paginacion
            listaProductosPaginaActualFinal: 1, // ultima pagina de la paginacion
            listaProductosFinal: 10, // numero de productos mostados por pagina
            productoSeleccionadoAhora: {} // producto seleccionado
        }
    },
	mounted: function () {
		this.obtenerListadoProductos();
        this.calcularBotones();
	},
    methods: {
        buscadorBTN: function () {
            var valorBuscar = document.getElementById('buscadorInput').value;
            
            if (valorBuscar == "") {
                this.listaProductos = this.listaProductosCopia;
            } else {
                this.listaProductos = this.listaProductosCopia;
                this.listaProductos = this.filtrarNuevoArray(valorBuscar);
            }

            this.listaProductosPagina = [];
            this.listaProductosPaginaFinal = [];
            this.paginarProductos(this.listaProductos);
            this.rellenarlistaProductosPaginaFinal();
        },
        filtrarNuevoArray: function (valor) {
            var array = [];
            var pasa = false;

            for (let i = 0; i < this.listaProductos.length; i++) {
                pasa = false;
                if (this.listaProductos[i].codigo.toString().includes(valor)) {
                    pasa = true;
                } else if (this.listaProductos[i].descripcion.toLowerCase().includes(valor.toLowerCase())) {
                    pasa = true;
                } else if (this.listaProductos[i].precio.toString().includes(valor)) {
                    pasa = true;
                }

                if (pasa) {
                    array.push(this.listaProductos[i]);
                }
            }

            return array;
        },
        calcularBotones: function () {
            var btnAtras = document.getElementById('btn-atras');
            var btnAdelante = document.getElementById('btn-adelante');

            if (this.listaProductosPaginaActual == 1) {
                btnAtras.className += ' disabled';
            } else {
                btnAtras.className = 'page-item';
            }

            if (this.listaProductosPaginaActual == this.listaProductosPaginaActualFinal) {
                btnAdelante.className += ' disabled';
            } else {
                btnAdelante.className = 'page-item';
            }
        },
        botonAdelanteFunc: function () {
            var nuevaPagina = this.listaProductosPaginaActual + 1;
            this.seleccionPagina(nuevaPagina);
        },
        botonAtrasFunc: function () {
            var nuevaPagina = this.listaProductosPaginaActual - 1;
            this.seleccionPagina(nuevaPagina);
        },
        productoSeleccionadoFunc: function (producto) {
            this.productoSeleccionado = {};
            document.getElementById('idProducto').innerHTML = producto.codigo;
            document.getElementById('Descricion-name').value = producto.descripcion;
            document.getElementById('Precio-name').value = producto.precio;
            this.productoSeleccionado = producto;
        },
        editarProducto: function () {
            var descripcion = document.getElementById('Descricion-name').value;
            var precio = document.getElementById('Precio-name').value;

            var ruta = '/api/productos/actualizar/' + this.productoSeleccionado.codigo + '/' + descripcion + '/' + precio;
            axios.get(ruta)
            .then(response => {
                if (response.data) {
                    $('#mmodalEditar').modal('toggle');
                    location.reload(true);
                }
            })
            .catch(e => {
                // Capturamos los errores
                console.log('error en editarProducto ---- paginaTablaProductos.js ---- ' + e);
            });
        },
        eliminarProducto: function () {

            var ruta = '/api/productos/borrar/' + this.productoSeleccionado.codigo;
            axios.get(ruta)
            .then(response => {
                if (response.data) {
                    $('#mmodalBorrado').modal('toggle');
                    location.reload(true);
                }
            })
            .catch(e => {
                // Capturamos los errores
                console.log('error en eliminarProducto ---- paginaTablaProductos.js ---- ' + e);
            });

        },
        crearProducto: function () {
            var datos = {
                descripcion: document.getElementById('Descricion-name-nuevo').value,
                precio: document.getElementById('Precio-name-nuevo').value
            }

            var ruta = '/api/productos/crear/' + datos.descripcion + '/' + datos.precio;
            axios.get(ruta)
            .then(response => {
                if (response.data) {
                    $('#mmodalNuevo').modal('toggle');
                    location.reload(true);
                }
            })
            .catch(e => {
                // Capturamos los errores
                console.log('error en crearProductos ---- paginaTablaProductos.js ---- ' + e);
            });
        },
        seleccionPagina: function (pagina) {
            this.listaProductosPaginaActual = pagina;
            this.rellenarlistaProductosPaginaFinal();
            this.calcularBotones();
        },
        cambiarVistaProductos: function () {
            var inputChange = document.getElementById('numeroDeProductos');
            this.listaProductosFinal = inputChange.value;
            this.listaProductosPagina = [];
            this.paginarProductos(this.listaProductos);
            this.rellenarlistaProductosPaginaFinal();
            this.calcularBotones();
        },
        obtenerListadoProductos: function() {
            var ruta = "/api/productos/listadoTotal";
            axios.get(ruta)
            .then(response => {
                this.listaProductos = response.data;
                this.listaProductosCopia = response.data;
                this.paginarProductos(response.data);
                this.rellenarlistaProductosPaginaFinal();
            })
            .catch(e => {
                // Capturamos los errores
                console.log('error en listadoProductos ---- paginaTablaProductos.js ---- ' + e);
            });
        },
        paginarProductos: function (lista) {
            var pagina = 1;
            var numeroProductos = this.listaProductosFinal;
            var numeroProductosAntes = 0;
            var listaPagina = [];
            var vuelta = true;

            while (vuelta) {
                listaPagina.push(pagina);
                var ini = numeroProductosAntes;
                var fin = numeroProductos * pagina;

                for (var i = ini; i < fin; i++) {
                    if (lista[i] != undefined) {
                        listaPagina.push(lista[i]);
                    }
                }

                this.listaProductosPagina.push(listaPagina);

                if (lista.length <= fin) {
                    vuelta = false;
                } else {
                    numeroProductosAntes = fin;
                    pagina++;
                    listaPagina = [];
                }
            }

            this.listaProductosPaginaActualFinal = pagina;
        },
        rellenarlistaProductosPaginaFinal: function () {
            this.listaProductosPaginaFinal = [];
            for (let f = 0; f < this.listaProductosPagina.length; f++) {
                if (this.listaProductosPagina[f][0] == this.listaProductosPaginaActual) {
                    for (let g = 1; g < this.listaProductosPagina[f].length; g++) {
                        this.listaProductosPaginaFinal.push(this.listaProductosPagina[f][g]);
                    }
                }
            }
        }
    },
    template:`
    <div class="container">
        <div class="row">
            <div class="col-sm-8"><p>Mostrar <input type="number" name="" id="numeroDeProductos" value="10" min="1" @change="cambiarVistaProductos()"> registros</p></div>
            <div class="col-sm-4"><p>Buscar: <input type="text" name="" id="buscadorInput" @input="buscadorBTN()"></p></div>
        </div>
        <div class="row">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Codigo </th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Precio</th>
                        <th scope="col">modificar</th>
                        <th scope="col">borrar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="producto in listaProductosPaginaFinal" v-bind:key="producto.codigo">
                        <th scope="row">{{producto.codigo}}</th>
                        <td>{{producto.descripcion}}</td>
                        <td>{{producto.precio}}</td>
                        <td><button type="button" class="btn btn-success" @click="productoSeleccionadoFunc(producto)" data-toggle="modal" data-target="#mmodalEditar">Editar</button></td>
                        <td><button type="button" class="btn btn-danger" @click="productoSeleccionadoFunc(producto)" data-toggle="modal" data-target="#mmodalBorrado">Borrar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-sm-8"><p>Pagina Actual: {{listaProductosPaginaActual}}</p></div>

            <div class="col-sm-4">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item" id="btn-atras"><a class="page-link" href="#" @click="botonAtrasFunc()">Atras</a></li>
                        <li class="page-item" v-for="(value, index) in listaProductosPagina" :id="index+1"><a class="page-link" href="#" @click="seleccionPagina(index+1)">{{ index+1 }}</a></li>
                        <li class="page-item" id="btn-adelante"><a class="page-link" href="#" @click="botonAdelanteFunc()">Adelante</a></li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="row">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#mmodalNuevo">Agregar articulo</button>
        </div>

        <!-- modal eliminar --->

        <div class="modal fade" id="mmodalBorrado" tabindex="-1" role="dialog" aria-labelledby="borrar articulo" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalBorrarTitulo">Borrar articulo</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Esta seguro de borra el articulo  con el codigo <span id="idProducto">  </span>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="eliminarProducto()">SI</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">NO</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- modal editar --->

        <div class="modal fade" id="mmodalEditar" tabindex="-1" role="dialog" aria-labelledby="editar articulo" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalEditarTitulo">Editar Articulo</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="Descricion-name" class="col-form-label">Descricion:</label>
                            <input type="text" class="form-control" id="Descricion-name">
                        </div>
                        <div class="form-group">
                            <label for="Precio-name" class="col-form-label">Precio:</label>
                            <input type="number" class="form-control" id="Precio-name">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="editarProducto()">Editar</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- modal nuevo --->

        <div class="modal fade" id="mmodalNuevo" tabindex="-1" role="dialog" aria-labelledby="nuevo articulo" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalNuevoTitulo">Nuevo Articulo</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="Descricion-name" class="col-form-label">Descricion:</label>
                            <input type="text" class="form-control" id="Descricion-name-nuevo">
                        </div>
                        <div class="form-group">
                            <label for="Precio-name" class="col-form-label">Precio:</label>
                            <input type="number" class="form-control" id="Precio-name-nuevo">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="crearProducto()">Crear</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
});
    