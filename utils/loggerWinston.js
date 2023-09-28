const express = require('express');
const { createLogger, format, transports } = require('winston');

const app = express();
const PORT = 8080;

// Configura los niveles de registro
const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

// Configuración del logger para desarrollo
const developmentLogger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new transports.Console()],
  level: 'debug' // Solo muestra desde nivel 'debug' en adelante
});

// Configuración del logger para producción
const productionLogger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'errors.log', level: 'error' }) // Almacena errores en 'errors.log'
  ],
  level: 'info' // Solo muestra desde nivel 'info' en adelante
});

// Endpoint para probar los registros
app.get('/loggerTest', (req, res) => {
  developmentLogger.debug('Este es un mensaje de depuración (debug)');
  developmentLogger.http('Este es un mensaje HTTP (http)');
  developmentLogger.info('Este es un mensaje de información (info)');
  developmentLogger.warning('Este es un mensaje de advertencia (warning)');
  developmentLogger.error('Este es un mensaje de error (error)');
  developmentLogger.fatal('Este es un mensaje fatal (fatal)');

  productionLogger.debug('Este es un mensaje de depuración (debug)');
  productionLogger.http('Este es un mensaje HTTP (http)');
  productionLogger.info('Este es un mensaje de información (info)');
  productionLogger.warning('Este es un mensaje de advertencia (warning)');
  productionLogger.error('Este es un mensaje de error (error)');
  productionLogger.fatal('Este es un mensaje fatal (fatal)');

  res.send('Verifica los registros en la consola y el archivo errors.log.');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
