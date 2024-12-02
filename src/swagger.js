import swaggerJsdoc from 'swagger-jsdoc';
import swaggerU from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ichgram API',
            version: '1.0.0',
            description: 'Documentation to Ichgram API full stack course',
        },
    },
    apis: ['./src/routes/*.js'], // Path to your API routes
};

export const specs = swaggerJsdoc(options);
console.log(specs)
export const swaggerUi = swaggerU;