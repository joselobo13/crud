var mysql=require('mysql');

var con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'base1'
});

// probamos la conexión
con.connect((err) => {
if(err){
  console.log('Error al conectar con BBDD: ' + err);
  return;
}
  console.log('Connection establecida con la BBDD');
});

module.exports=con;