const express = require('express');
const app = express();
const Task = require("./../models/task");

app.get('/', function(req, res) {
    res.json({
        'success': true,
        'message': 'Welcome to NODEJS + MONGODB + COMPASS + EXPRESSS',
        'data': []
    })
});

app.get('/task', function(req, res) {
    Task.find({})
        .exec((err, taskList) => {
            if (err) {
                return res.json({
                    'success': false,
                    'message': err.message,
                    'data': []
                });
            }
            if (!taskList.length) {
                return res.json({
                    'success': false,
                    'message': 'No tienes tareas',
                })
            }
            return res.json({
                'success': true,
                'message': 'Task List',
                'data': [taskList]
            })

        });
});

app.post('/task', function(req, res) {
    let data = req.body;
    let task = new Task({
        title: data.title,
        description: data.description,
        image_url: data.image_url,
    });

    task.save((err, taskDB) => {
        if (err) {
            return res.status(400).json({
                'success': false,
                'message': err,
                'data': []
            });
        }
        return res.json({
            'success': true,
            'message': 'Task saved successfully',
            'data': [taskDB]
        })
    });
});

app.get('/task/:id', function(req, res) {
    let id = req.params.id;

    Task.findById(id)
        .exec((err, taskDetail) => {
            if (err) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No se ha encontrado',
                    'data': []
                });
            }
            return res.json({
                'success': true,
                'message': 'Task',
                'data': [taskDetail]
            })
        });
});


//Actualizar la informacion
app.put('/task/:id', function(req, res) {
    let id = req.params.id;
    let data = req.body;

    const { title, description } = data;


    let actualizar = { title, description };
    // Captura solo el titulo y la descripcion, cualquier otra info es ignorada

    Task.findByIdAndUpdate(id, actualizar, { new: true, runValidators: true }, (err, taskDB) => {
        if (err) {
            return res.status(400).json({
                'success': false,
                'message': err,
                'data': []
            });
        }
        return res.json({
            'success': true,
            'message': 'actualizado corretcamente',
            'data': [taskDB]
        })
    });
});

// Cambiar el estado de activo a inactivo y viseversa
app.delete('/task/:id', function(req, res) {
    let id = req.params.id;
    Task.findById(id)
        .exec((err, taskDetail) => {
            if (err) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No se ha encontrado',
                    'data': []
                });
            }
            (taskDetail.active ? actualizarEstado(true, id, res) : actualizarEstado(false, id, res));
        });

});

const actualizarEstado = (estado, id, res) => {
    let data = { active: (estado ? false : true) };
    Task.findByIdAndUpdate(id, data, { new: false, runValidators: true }, (err, taskDB) => {
        if (err) {
            return res.status(400).json({
                'success': false,
                'message': err,
                'data': []
            });
        }
        if (!taskDB) {
            return res.json({
                'success': false,
                'message': 'no ha sido encontrada',
                'data': []
            });
        }
        return res.json({
            'success': true,
            'message': 'actualizado correctamente',
            'data': [taskDB]
        })
    });
}

//Eliminar la tarea
app.delete('/task/delete/:id', function(req, res) {
    let id = req.params.id;
    Task.findByIdAndDelete(id, (err, taskDB) => {
        if (err) {
            return res.status(400).json({
                'success': false,
                'message': err,
                'data': []
            });
        }
        if (!taskDB) {
            return res.json({
                'success': false,
                'message': 'no ha sido encontrada',
                'data': []
            });
        }
        return res.json({
            'success': true,
            'message': 'La tarea eliminada',
            'data': [taskDB]
        })
    });
});
module.exports = app;