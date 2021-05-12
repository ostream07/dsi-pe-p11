import * as express from 'express';
import { spawn } from "child_process";

type Command = {
  cmd: string,
  args?: string[],
  errorMessage?: string
};

const app = express();

// Manejador get (petición, respuesta)
app.get('/execcmd', (req, res) => {
  console.log(req.query);
  // Sino lo encuentra, devuelve un objeto JSON con un error
  if (!req.query.cmd) {
    return res.send({
      error: 'Se requiere de un comando',
    });

  } else {
    let args: string[] = [];
    if(typeof req.query.args === 'string') {
      args = req.query.args.split(/\s+/);
    }

    let cmd = {
      cmd: req.query.cmd as string, args: args
    };
    unixCommand(cmd, (error, output) =>  {
      if (error) {
        res.send({
          error: error,
        });
      } else {
        res.send({
          output: output,
        });
      }
    })
  }
})


// Manejador, patrón callback
const unixCommand = ( usage: Command, callback: (error: string | undefined, outout: string | undefined) => void) => {
  const cmd = spawn(usage.cmd, usage.args);

  cmd.on('error', () => {
    console.log('Error! No se pudo ejecutar el comando')
  });

  let output = '';
  cmd.stdout.on('data', (chunk) =>
    output += chunk
  );

  let errorString = '';
  cmd.stderr.on('data', (chunk) => {
    errorString += chunk
  });

  cmd.on('close', (code) => {
    if(code! < 0) {
      callback(`Error, no se pudo ejecutar ${code}`, undefined);
    } else if(code === 0) {
      callback(undefined, `Acción realizada con éxito: ${output}`);
    } else {
      callback(undefined, output);
    }
    if(code === 1) {
      callback(`Error al ejecutar el comando: ${code}`, undefined);
    }
  })
};


app.get('*', (_, res) => {
  res.send('<h1>404</h1>');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});





