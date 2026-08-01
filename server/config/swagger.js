const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zen Mental Wellness API',
      version: '1.0.0',
      description: 'API documentation for Zen Mental Wellness Platform featuring RAG AI Chatbot, SSE Streaming, AES-256 Encrypted Journals, and AI Emotional Correlation Insights.',
      contact: {
        name: 'Zen Engineering Team',
        url: 'https://github.com/vaishnavk09/Zen-v2'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Journal: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string', description: 'Transparently encrypted with AES-256-GCM in database' },
            date: { type: 'string', format: 'date-time' },
            user: { type: 'string' }
          }
        },
        Mood: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            mood: { type: 'integer', minimum: 1, maximum: 5 },
            notes: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            activities: { type: 'array', items: { type: 'string' } },
            date: { type: 'string', format: 'date-time' }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            message: { type: 'string' },
            isUser: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
