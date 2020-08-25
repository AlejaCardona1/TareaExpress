const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const controller = require("./controllers/task_controller");
const app = express()
const port = process.env.PORT | 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(controller);

mongoose.connect('mongodb://localhost:27017/task_bd', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log("Conectado a la DB");
});

app.listen(port, () => {
    console.log(`API Listening at http://localhost:${port}`)
})

/*
Apreciados estudiantes.
Nuestro segundo entregable será, a partir del proyecto del repositorio, terminar el CRUD completo. Adicional tener todas las validaciones correspondientes:
* Si al buscar un documento, el sistema no lo encuentra, la respuesta debe ser "false" y mostrar un mensaje acorde.
* Si al listar todos los documentos, el sistema no encuentra nada, la respuesta debe ser "false" y mostrar un mensaje acorde.
* Al eliminar definitivamente un elemento, enviar un mensaje acorde.
* Usar un verbo para actualizar la información y otro para cambiar el estado de la tarea.
* Como restricción, la imagen no se puede cambiar, solo el título y descripción.
*/