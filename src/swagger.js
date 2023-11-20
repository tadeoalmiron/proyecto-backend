const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.1', 
    info: {
      title: 'API de mi Proyecto', 
      version: '1.0.0', 
      description: 'Documentación de la API de mi Proyecto',
    },
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
