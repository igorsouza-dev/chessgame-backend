import Game from '../models/Game';

export default async (req, res, next) => {
  const { browser_id } = req.headers;
  if (!browser_id) {
    return res.status(400).json({ error: 'No browser id' });
  }
  req.browserId = browser_id;

  const game = await Game.findOne({
    where: { browser_id: req.browserId },
  });
  if (!game) {
    return res.status(400).json({ error: 'Game not found!' });
  }
  req.game = game;
  return next();
};
