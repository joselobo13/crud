var express = require('express');
var router = express.Router();

var bd = require('./bd');

// mostrar todos los clientes
router.get('/api/productos/listadoTotal', (req,res)=>{
    
    var query = 'SELECT * FROM articulos'; 
  
    bd.query(query, function (error,filas) {
      if (error) {
        console.log('Error al buscar los productos totales ' + err);
      } else {
        res.send(filas);
      }
    });
});

// crea nuevo producto
router.get('/api/productos/crear/:descripcion/:precio', (req,res)=>{
  
  var query = "INSERT INTO base1.articulos (descripcion,precio) VALUES ('" + req.params.descripcion + "', '" + req.params.precio + "')"; 

  bd.query(query, function (error,filas) {
    if (error) {
      console.log('Error al insertar un producto ' + err);
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

// borrar producto
router.get('/api/productos/borrar/:id', (req,res)=>{
  
  var query = "delete from articulos where codigo = " + req.params.id; 

  bd.query(query, function (error,filas) {
    if (error) {
      console.log('Error al borrar el producto ' + req.params.id + ' --- ' + error);
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

// actualizar producto
router.get('/api/productos/actualizar/:id/:decripcion/:precio', (req,res)=>{
  
  var query = "update articulos set descripcion = '" + req.params.decripcion + "', precio = " + req.params.precio  + " where codigo = '" + req.params.id + "'" ; 
  console.log()

  bd.query(query, function (error,filas) {
    if (error) {
      console.log('Error al actualizar el producto ' + req.params.id + ' --- ' + error);
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

module.exports = router;