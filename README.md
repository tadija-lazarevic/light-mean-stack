## About

Light mean stack which uses Angular 1.5, Express 4, MongoDB and Mongoose API and Socket.IO implemented.

## Installation

To runn application:

npm install

bower install

Create .env file in root directory and add:

DB_URL = 'mongodb://localhost/mytalentlife'

ENV    = 'production'

PORT   = 3200

or other secret variables.

When done adding db url, run npm debug and it will use nodemon so every change of server files will triger localserver to restart.
