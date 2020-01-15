import { Router } from 'express';
import GameController from './app/controllers/GameController';
import browserIdMiddleware from './app/middlewares/browserId';
import lastBoard from './app/middlewares/lastBoard';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Api OK!' });
});

routes.post('/new-game', GameController.newGame);

routes.use(browserIdMiddleware);
routes.get('/load-game', GameController.loadGame);
routes.get('/legal-moves/:position', GameController.legalMoves);
routes.get('/make-move/:from/:to', lastBoard, GameController.makeMove);
export default routes;
