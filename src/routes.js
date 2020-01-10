import { Router } from 'express';
import GameController from './app/controllers/GameController';

const routes = new Router();
routes.post('/games', GameController.store);
routes.get('/games', GameController.index);
export default routes;
