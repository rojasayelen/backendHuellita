const express = require('express');
require('dotenv').config();

const app = express();

// Determinacion del puerto del servidor
const port = process.env.PORT || 3000;

//Definicion del servidor
app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

// Importar el archivo de rutas de turnos
const consultaTurnosRouter = require("./routes/consultaTurnosRouter");

app.use('/turnos', consultaTurnosRouter);

app.listen(port, () => {
    console.log(`Server corriendo en http://localhost:${port}`);
    }
);

