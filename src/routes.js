import { Router } from 'express';
import GameController from './app/controllers/GameController';
import BoardController from './app/controllers/BoardController';
import browserIdMiddleware from './app/middlewares/browserId';
import MoveController from './app/controllers/MoveController';

const routes = new Router();
routes.post('/games', GameController.store);

routes.use(browserIdMiddleware);
routes.get('/games', GameController.index);
routes.post('/boards', BoardController.store);
routes.get('/boards', BoardController.index);

routes.post('/moves', MoveController.store);
export default routes;
