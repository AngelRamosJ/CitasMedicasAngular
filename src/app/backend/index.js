var app = require('./app');
var port = 3700;
app.listen(port,'192.168.1.124',function(){
    console.log("Servidor corriendo correctamente en la url: localhost:3700");
});