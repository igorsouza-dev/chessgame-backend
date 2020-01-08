import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import Youch from 'youch';

import routes from './routes';
// import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(err.status || 500).json(errors);
      }
      return res
        .status(err.status || 500)
        .json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
