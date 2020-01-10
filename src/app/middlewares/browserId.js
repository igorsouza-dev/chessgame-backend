export default async (req, res, next) => {
  const { browser_id } = req.headers;
  if (!browser_id) {
    return res.status(400).json({ error: 'No browser id' });
  }
  req.browserId = browser_id;
  return next();
};
