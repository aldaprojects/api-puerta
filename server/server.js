const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Conexion con la base de datos
mongoose.connect('mongodb://localhost/sspca', 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, 
    function(err) {
        if( err ) throw err;
        console.log('Base de datos online');
    }
);

// Configuracion global de las rutas
app.get('/usuario', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'it works'
    })
});

app.listen(port, () => {
    console.log(`Servidor encendido correctamente con el puerto ${ port }`);
});