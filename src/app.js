import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.server = express();
    if (process.env.NODE_ENV === 'production') {
      Sentry.init(sentryConfig);
      this.server.use(Sentry.Handlers.requestHandler());
    }
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
    if (process.env.NODE_ENV === 'production')
      this.server.use(Sentry.Handlers.errorHandler());
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
