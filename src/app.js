"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const child_process_1 = require("child_process");
const app = express();
// Manejador get (petición, respuesta)
app.get('/execmd', (req, res) => {
    console.log(req.query);
    // Sino lo encuentra, devuelve un objeto JSON con un error
    if (!req.query.cmd) {
        return res.send({
            error: 'Se requiere de un comando',
        });
    }
    else {
        let args = [];
        if (typeof req.query.args === 'string') {
            args = req.query.args.split(/\s+/);
        }
        let cmd = {
            cmd: req.query.cmd,
            args: args
        };
        unixCommand(cmd, (error, output) => {
            if (error) {
                res.send({
                    error: error,
                });
            }
            else {
                res.send({
                    output: output,
                });
            }
        });
    }
});
// Manejador, patrón callback
const unixCommand = (usage, callback) => {
    const cmd = child_process_1.spawn(usage.cmd, usage.args);
    cmd.on('error', () => {
        console.log('Error! No se pudo ejecutar el comando');
    });
    let output = '';
    cmd.stdout.on('data', (chunk) => output += chunk);
    let errorString = '';
    cmd.stderr.on('data', (chunk) => {
        errorString += chunk;
    });
    cmd.on('close', (code) => {
        if (code < 0) {
            callback(`Error, no se pudo ejecutar ${code}`, undefined);
        }
        else {
            callback(undefined, output);
        }
        if (code === 0) {
            callback('Acción realizada con éxito', undefined);
        }
        else {
            callback(undefined, output);
        }
        if (code === 1) {
            callback('Error al ejecutar el comando', undefined);
        }
        else {
            callback(undefined, output);
        }
    });
};
app.get('*', (_, res) => {
    res.send('<h1>404</h1>');
});
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
