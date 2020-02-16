const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');

require('./config/config');

app.use(express.static( path.resolve(__dirname, '../public') ));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Conexion con la base de datos
mongoose.connect(process.env.URL_DB, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, 
    function(err) {
        if( err ) throw err;
        console.log('Base de datos online');
    }
);

// Configuracion global de las rutas
app.use( require('./routes/index') );

app.listen(process.env.PORT, () => {
    console.log(`Servidor encendido correctamente con el puerto ${ process.env.PORT }`);
});